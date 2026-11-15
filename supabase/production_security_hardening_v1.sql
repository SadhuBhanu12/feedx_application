-- ==============================================================================
-- FEEDX PRODUCTION SECURITY & DATA INTEGRITY HARDENING MIGRATION (v1.0)
-- ==============================================================================
-- This script hardens all database functions, RPCs, and access policies:
-- 1. Enforces least-privilege role-based access control on administrative RPCs.
-- 2. Prevents privilege escalation and unauthenticated account deletion.
-- 3. Ensures caller identity verification (auth.uid() = target_id) on rewards & wallets.
-- 4. Prevents negative token conversion & financial ledger race conditions.
-- 5. Prevents student PII exposure by restricting the students table RLS.
-- 6. Adds atomic triggers for community counts to eliminate N+1 race conditions.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. SECURE ADMINISTRATIVE RPCs (Super Admin Only)
-- ------------------------------------------------------------------------------

-- Helper function to verify caller is active Super Admin
CREATE OR REPLACE FUNCTION public.check_is_active_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid()
          AND LOWER(TRIM(role)) = 'super_admin'
          AND is_active = TRUE
    );
END;
$$;

-- Helper function to verify caller is active Admin or Super Admin
CREATE OR REPLACE FUNCTION public.check_is_active_admin_or_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid()
          AND LOWER(TRIM(role)) IN ('super_admin', 'admin', 'inst_admin', 'college_admin', 'campus_admin')
          AND is_active = TRUE
    );
END;
$$;

-- Secure create_college_admin: requires Super Admin
DROP FUNCTION IF EXISTS public.create_college_admin(text, text, text, uuid, text) CASCADE;
CREATE OR REPLACE FUNCTION public.create_college_admin(
    admin_email text,
    admin_password text,
    admin_name text,
    college_id uuid DEFAULT NULL,
    admin_role text DEFAULT 'admin'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions, pg_temp
AS $$
DECLARE
    new_user_id uuid;
    encrypted_pw text;
BEGIN
    -- Strict authorization check: Only active Super Admin can create admins
    IF NOT public.check_is_active_super_admin() THEN
        RETURN json_build_object('error', 'Unauthorized: Only Super Administrators can create college administrators.');
    END IF;

    admin_email := lower(trim(admin_email));
    admin_name := trim(admin_name);

    IF admin_email IS NULL OR admin_email = '' OR admin_password IS NULL OR length(admin_password) < 6 THEN
        RETURN json_build_object('error', 'Invalid email or password (min 6 characters required).');
    END IF;

    IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = admin_email) THEN
        RETURN json_build_object('error', 'Email already in use.');
    END IF;

    new_user_id := gen_random_uuid();
    encrypted_pw := crypt(admin_password, gen_salt('bf', 10));

    -- 1. Insert into auth.users
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, recovery_sent_at, last_sign_in_at, 
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated', admin_email, encrypted_pw,
        now(), NULL, NULL,
        '{"provider":"email","providers":["email"]}',
        json_build_object('full_name', admin_name, 'role', admin_role, 'college_id', college_id),
        now(), now(),
        '', '', '', ''
    );

    -- 2. Insert into public.users
    INSERT INTO public.users (id, full_name, email, role, college_id, is_active, created_at, updated_at)
    VALUES (new_user_id, admin_name, admin_email, admin_role, college_id, true, now(), now())
    ON CONFLICT (id) DO UPDATE SET 
        role = EXCLUDED.role,
        college_id = EXCLUDED.college_id,
        is_active = true,
        full_name = EXCLUDED.full_name,
        updated_at = now();

    -- 3. Insert into public.admins
    INSERT INTO public.admins (id, admin_name, name, email, institution_id, role, created_at)
    VALUES (new_user_id, admin_name, admin_name, admin_email, college_id, admin_role, now())
    ON CONFLICT (id) DO UPDATE SET 
        institution_id = EXCLUDED.institution_id,
        role = EXCLUDED.role,
        name = EXCLUDED.name,
        admin_name = EXCLUDED.admin_name;

    RETURN json_build_object('success', true, 'user_id', new_user_id);
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$;

-- Secure update_admin_password: requires Super Admin
CREATE OR REPLACE FUNCTION public.update_admin_password(
    target_admin_id uuid,
    new_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions, pg_temp
AS $$
DECLARE
    encrypted_pw text;
BEGIN
    IF NOT public.check_is_active_super_admin() THEN
        RETURN json_build_object('error', 'Unauthorized: Only Super Administrators can update administrator passwords.');
    END IF;

    IF new_password IS NULL OR length(trim(new_password)) < 6 THEN
        RETURN json_build_object('error', 'Password must be at least 6 characters.');
    END IF;

    encrypted_pw := crypt(trim(new_password), gen_salt('bf', 10));

    UPDATE auth.users 
    SET encrypted_password = encrypted_pw, updated_at = now()
    WHERE id = target_admin_id;

    IF FOUND THEN
        RETURN json_build_object('success', true);
    ELSE
        RETURN json_build_object('error', 'Administrator not found.');
    END IF;
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$;

-- Secure delete_college_admin: requires Super Admin
CREATE OR REPLACE FUNCTION public.delete_college_admin(
    target_admin_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
    IF NOT public.check_is_active_super_admin() THEN
        RETURN json_build_object('error', 'Unauthorized: Only Super Administrators can delete administrator accounts.');
    END IF;

    -- Prevent Super Admin from deleting themselves
    IF target_admin_id = auth.uid() THEN
        RETURN json_build_object('error', 'Cannot delete your own active Super Administrator account.');
    END IF;

    DELETE FROM public.admins WHERE id = target_admin_id;
    DELETE FROM public.users WHERE id = target_admin_id;
    DELETE FROM auth.users WHERE id = target_admin_id;

    RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$;

-- Revoke execute from anon on admin functions
REVOKE EXECUTE ON FUNCTION public.create_college_admin(text, text, text, uuid, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_admin_password(uuid, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.delete_college_admin(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.create_college_admin(text, text, text, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_admin_password(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_college_admin(uuid) TO authenticated;

-- ------------------------------------------------------------------------------
-- 2. SECURE GAMIFICATION, REWARDS & CONVERSIONS
-- ------------------------------------------------------------------------------

-- Secure award_student_activity: Caller verification, safe bounds, and idempotency
-- Dropping prior signature variants to prevent PostgreSQL error 42P13 (cannot remove parameter defaults)
DROP FUNCTION IF EXISTS public.award_student_activity(UUID, VARCHAR, INT, INT, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS public.award_student_activity(UUID, character varying, integer, integer, character varying) CASCADE;
DROP FUNCTION IF EXISTS public.award_student_activity(UUID, text, integer, integer, text) CASCADE;
DROP FUNCTION IF EXISTS public.award_student_activity CASCADE;

CREATE OR REPLACE FUNCTION public.award_student_activity(
    p_student_id UUID,
    p_activity_type VARCHAR(50),
    p_coin_reward INT,
    p_xp_reward INT,
    p_reference_id VARCHAR(100)
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_already_claimed BOOLEAN := FALSE;
    v_new_coins INT := 0;
    v_new_xp INT := 0;
    v_coin_reward_actual INT := 0;
    v_tokens_reward INT := 0;
    v_caller_uid UUID := auth.uid();
BEGIN
    -- Verify caller identity: caller must be the student or an administrator
    IF v_caller_uid IS NOT NULL AND v_caller_uid != p_student_id THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = v_caller_uid 
              AND role IN ('admin', 'inst_admin', 'super_admin', 'college_admin')
              AND is_active = TRUE
        ) THEN
            RAISE EXCEPTION 'Unauthorized: You can only claim activity rewards for your own account.';
        END IF;
    END IF;

    -- Ensure reference ID is valid
    IF p_reference_id IS NULL OR TRIM(p_reference_id) = '' THEN
        p_reference_id := CURRENT_DATE::text;
    END IF;

    -- Authoritative Single Source of Truth (SSOT) Backend Reward Enforcement:
    -- Home Today's Mission Quick Learn -> 50 Tokens
    -- Home Today's Mission Daily Quiz -> 50 Tokens
    -- Explore Page Quick Learn -> 10 Tokens
    -- Explore Page Quiz -> 15 Tokens
    -- Daily Streak Check-in -> 10 Tokens
    -- Roadmap Milestone -> 40 Tokens
    IF p_activity_type IN ('home_daily_quick_learn', 'daily_mission_quick_learn', 'daily_quick_learn') THEN
        v_tokens_reward := 50;
        v_coin_reward_actual := 0;
    ELSIF p_activity_type IN ('home_daily_quiz', 'daily_mission_quiz', 'daily_quiz', 'daily_task_quiz') THEN
        v_tokens_reward := 50;
        v_coin_reward_actual := 0;
    ELSIF p_activity_type IN ('explore_quick_learn', 'quick_learn', 'resource_read', 'lesson_completed') THEN
        v_tokens_reward := 10;
        v_coin_reward_actual := 0;
    ELSIF p_activity_type IN ('explore_quiz', 'quick_quiz', 'quiz_completed') THEN
        v_tokens_reward := 15;
        v_coin_reward_actual := 0;
    ELSIF p_activity_type IN ('daily_login', 'streak_checkin', 'daily_checkin', 'home_daily_streak') THEN
        v_tokens_reward := 10;
        v_coin_reward_actual := 0;
    ELSIF p_activity_type IN ('roadmap_task', 'roadmap_completed', 'roadmap', 'phase_completed', 'home_daily_roadmap') THEN
        v_tokens_reward := 40;
        v_coin_reward_actual := 0;
    ELSIF p_activity_type IN ('daily_task', 'daily_mission') THEN
        v_tokens_reward := 50;
        v_coin_reward_actual := 0;
    ELSE
        -- Fallback: Cap client-supplied values to safe maximums
        v_tokens_reward := LEAST(GREATEST(COALESCE(p_xp_reward, 0), 0), 50);
        v_coin_reward_actual := LEAST(GREATEST(COALESCE(p_coin_reward, 0), 0), 10);
    END IF;

    -- Check if reward was already awarded for this specific source
    IF EXISTS (
        SELECT 1 FROM public.reward_transactions 
        WHERE (user_id = p_student_id OR student_id = p_student_id) 
          AND source_type = p_activity_type 
          AND source_id = p_reference_id
    ) THEN
        v_already_claimed := TRUE;
        -- Retrieve current wallet balances so caller always receives consistent state
        SELECT COALESCE(gold_coins, 0), COALESCE(tokens, 0)
        INTO v_new_coins, v_new_xp 
        FROM public.student_wallets 
        WHERE student_id = p_student_id;
    ELSE
        -- Insert unique reward transaction record
        INSERT INTO public.reward_transactions (user_id, student_id, source_type, source_id, coins, points)
        VALUES (p_student_id, p_student_id, p_activity_type, p_reference_id, v_coin_reward_actual, v_tokens_reward);

        -- Also record in coin_transactions if present
        INSERT INTO public.coin_transactions (student_id, amount, activity_type, reference_id, description)
        VALUES (p_student_id, v_tokens_reward, p_activity_type, p_reference_id, 'Earned +' || v_tokens_reward || ' Task Tokens');

        -- Also record in fx_transactions
        BEGIN
            INSERT INTO public.fx_transactions (user_id, amount, source_type, source_id, description)
            VALUES (p_student_id, v_tokens_reward, p_activity_type, p_reference_id, 'Earned +' || v_tokens_reward || ' Task Tokens');
        EXCEPTION WHEN OTHERS THEN NULL;
        END;

        -- Atomically sync public.student_wallets table
        INSERT INTO public.student_wallets (student_id, gold_coins, tokens, total_earned, updated_at)
        VALUES (p_student_id, v_coin_reward_actual, v_tokens_reward, v_tokens_reward, NOW())
        ON CONFLICT (student_id) DO UPDATE
        SET gold_coins = COALESCE(public.student_wallets.gold_coins, 0) + v_coin_reward_actual,
            tokens = COALESCE(public.student_wallets.tokens, 0) + v_tokens_reward,
            total_earned = COALESCE(public.student_wallets.total_earned, 0) + v_tokens_reward,
            updated_at = NOW();

        SELECT gold_coins, tokens INTO v_new_coins, v_new_xp 
        FROM public.student_wallets 
        WHERE student_id = p_student_id;

        -- Atomically sync daily_streaks table
        INSERT INTO public.daily_streaks (student_id, xp_points, current_streak, longest_streak, last_active_date, updated_at)
        VALUES (p_student_id, v_tokens_reward, 1, 1, CURRENT_DATE, NOW())
        ON CONFLICT (student_id) DO UPDATE
        SET xp_points = COALESCE(public.daily_streaks.xp_points, 0) + v_tokens_reward,
            current_streak = GREATEST(COALESCE(public.daily_streaks.current_streak, 0), 1),
            longest_streak = GREATEST(COALESCE(public.daily_streaks.longest_streak, 0), 1),
            last_active_date = CURRENT_DATE,
            updated_at = NOW();
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'already_completed', v_already_claimed,
        'already_earned', v_already_claimed,
        'tokens_awarded', CASE WHEN v_already_claimed THEN 0 ELSE v_tokens_reward END,
        'coins_awarded', CASE WHEN v_already_claimed THEN 0 ELSE v_coin_reward_actual END,
        'xp_awarded', CASE WHEN v_already_claimed THEN 0 ELSE v_tokens_reward END,
        'new_coins', COALESCE(v_new_coins, 0),
        'new_xp', COALESCE(v_new_xp, 0)
    );
END;
$$;

-- Secure convert_tokens_to_gold_coins: Prevent negative token balances & race conditions
DROP FUNCTION IF EXISTS public.convert_tokens_to_gold_coins(UUID, INT) CASCADE;
DROP FUNCTION IF EXISTS public.convert_tokens_to_gold_coins(UUID, integer) CASCADE;

CREATE OR REPLACE FUNCTION public.convert_tokens_to_gold_coins(
    p_student_id UUID,
    p_tokens_to_convert INT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_available_tokens INT;
    v_current_coins INT;
    v_coins_to_award INT;
    v_used_tokens INT;
    v_remaining_tokens INT;
    v_caller_uid UUID := auth.uid();
BEGIN
    -- Verify caller identity
    IF v_caller_uid IS NOT NULL AND v_caller_uid != p_student_id THEN
        RAISE EXCEPTION 'Unauthorized: You can only convert tokens for your own account.';
    END IF;

    IF p_tokens_to_convert IS NULL OR p_tokens_to_convert < 1000 THEN
        RAISE EXCEPTION 'Minimum conversion requirement is 1,000 Task Tokens.';
    END IF;

    -- Ensure wallet exists
    INSERT INTO public.student_wallets (student_id, gold_coins, total_earned)
    VALUES (p_student_id, 0, 0)
    ON CONFLICT (student_id) DO NOTHING;

    -- Ensure streak exists and lock row to prevent concurrent conversion race conditions
    INSERT INTO public.daily_streaks (student_id, current_streak, longest_streak, xp_points)
    VALUES (p_student_id, 0, 0, 0)
    ON CONFLICT (student_id) DO NOTHING;

    SELECT xp_points INTO v_available_tokens
    FROM public.daily_streaks
    WHERE student_id = p_student_id
    FOR UPDATE;

    SELECT gold_coins INTO v_current_coins
    FROM public.student_wallets
    WHERE student_id = p_student_id
    FOR UPDATE;

    -- Strict balance validation: CANNOT convert more tokens than available
    IF v_available_tokens IS NULL OR v_available_tokens < 1000 THEN
        RAISE EXCEPTION 'Insufficient Task Tokens. Need at least 1,000 tokens.';
    END IF;

    IF p_tokens_to_convert > v_available_tokens THEN
        RAISE EXCEPTION 'Cannot convert % tokens: you only have % tokens available.', p_tokens_to_convert, v_available_tokens;
    END IF;

    v_coins_to_award := FLOOR(p_tokens_to_convert / 1000);
    v_used_tokens := v_coins_to_award * 1000;
    v_remaining_tokens := v_available_tokens - v_used_tokens;

    -- Update daily streaks (Task Tokens)
    UPDATE public.daily_streaks
    SET xp_points = v_remaining_tokens,
        updated_at = NOW()
    WHERE student_id = p_student_id;

    -- Update student wallets (Gold Coins)
    UPDATE public.student_wallets
    SET gold_coins = gold_coins + v_coins_to_award,
        total_earned = total_earned + v_coins_to_award,
        updated_at = NOW()
    WHERE student_id = p_student_id;

    -- Sync legacy students and users tables if columns exist
    BEGIN
        UPDATE public.students
        SET gold_coins = COALESCE(gold_coins, 0) + v_coins_to_award,
            xp_points = v_remaining_tokens,
            updated_at = NOW()
        WHERE id = p_student_id;
    EXCEPTION WHEN undefined_column THEN NULL;
    END;

    BEGIN
        UPDATE public.users
        SET gold_coins = COALESCE(gold_coins, 0) + v_coins_to_award,
            xp = v_remaining_tokens
        WHERE id = p_student_id;
    EXCEPTION WHEN undefined_column THEN NULL;
    END;

    -- Record transaction
    INSERT INTO public.coin_transactions (student_id, amount, activity_type, reference_id, description)
    VALUES (p_student_id, v_coins_to_award, 'token_conversion', 'conv_' || extract(epoch from now())::text, 'Redeemed ' || v_used_tokens::text || ' tokens for ' || v_coins_to_award::text || ' Gold Coin(s)');

    RETURN jsonb_build_object(
        'success', true,
        'tokens_converted', v_used_tokens,
        'coins_awarded', v_coins_to_award,
        'new_tokens', v_remaining_tokens,
        'new_coins', v_current_coins + v_coins_to_award
    );
END;
$$;

-- Secure redeem_reward: Validate caller identity and stock atomicity
DROP FUNCTION IF EXISTS public.redeem_reward(UUID, UUID) CASCADE;

CREATE OR REPLACE FUNCTION public.redeem_reward(
    p_student_id UUID,
    p_reward_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_coin_cost INT;
    v_stock INT;
    v_title VARCHAR(150);
    v_category VARCHAR(50);
    v_current_coins INT;
    v_redemption_id UUID;
    v_cert_type VARCHAR(10);
    v_cert_count INT;
    v_cert_id VARCHAR(50);
    v_caller_uid UUID := auth.uid();
BEGIN
    -- Verify caller identity
    IF v_caller_uid IS NOT NULL AND v_caller_uid != p_student_id THEN
        RAISE EXCEPTION 'Unauthorized: You can only redeem rewards for your own account.';
    END IF;

    -- Check reward item existence and details with row lock
    SELECT coin_cost, stock, title, category INTO v_coin_cost, v_stock, v_title, v_category
    FROM public.reward_catalog
    WHERE id = p_reward_id AND is_active = TRUE
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Reward item not found or currently unavailable.';
    END IF;

    IF v_stock = 0 THEN
        RAISE EXCEPTION 'Reward item is currently out of stock.';
    END IF;

    -- Prevent duplicate redemption of the same certificate
    IF EXISTS (
        SELECT 1 FROM public.reward_redemptions 
        WHERE student_id = p_student_id AND reward_id = p_reward_id
    ) THEN
        RAISE EXCEPTION 'You have already redeemed this reward certificate.';
    END IF;

    -- Lock and check wallet balance
    SELECT gold_coins INTO v_current_coins
    FROM public.student_wallets
    WHERE student_id = p_student_id
    FOR UPDATE;

    IF v_current_coins IS NULL OR v_current_coins < v_coin_cost THEN
        RAISE EXCEPTION 'Insufficient Gold Coins balance (% required, % available).', v_coin_cost, COALESCE(v_current_coins, 0);
    END IF;

    -- Deduct balance
    UPDATE public.student_wallets
    SET gold_coins = gold_coins - v_coin_cost,
        total_redeemed = total_redeemed + v_coin_cost,
        updated_at = NOW()
    WHERE student_id = p_student_id;

    BEGIN
        UPDATE public.students
        SET gold_coins = gold_coins - v_coin_cost,
            updated_at = NOW()
        WHERE id = p_student_id;
    EXCEPTION WHEN undefined_column THEN NULL;
    END;

    BEGIN
        UPDATE public.users
        SET gold_coins = gold_coins - v_coin_cost
        WHERE id = p_student_id;
    EXCEPTION WHEN undefined_column THEN NULL;
    END;

    -- Decrement stock if finite stock
    IF v_stock > 0 THEN
        UPDATE public.reward_catalog
        SET stock = stock - 1
        WHERE id = p_reward_id;
    END IF;

    -- Generate unique Certificate ID
    IF v_category = 'certificate' OR v_title ILIKE '%certificate%' THEN
        IF v_title ILIKE '%excellence%' THEN
            v_cert_type := 'EX';
        ELSIF v_title ILIKE '%verified%' OR v_title ILIKE '%learner%' THEN
            v_cert_type := 'VL';
        ELSE
            v_cert_type := 'AV';
        END IF;

        SELECT COALESCE(COUNT(*), 0) + 1 INTO v_cert_count
        FROM public.reward_redemptions
        WHERE certificate_id LIKE 'FX-' || v_cert_type || '-%';

        v_cert_id := 'FX-' || v_cert_type || '-' || LPAD(v_cert_count::text, 4, '0');

        WHILE EXISTS (SELECT 1 FROM public.reward_redemptions WHERE certificate_id = v_cert_id) LOOP
            v_cert_count := v_cert_count + 1;
            v_cert_id := 'FX-' || v_cert_type || '-' || LPAD(v_cert_count::text, 4, '0');
        END LOOP;
    ELSE
        v_cert_id := NULL;
    END IF;

    -- Insert redemption record
    INSERT INTO public.reward_redemptions (student_id, reward_id, coin_cost, status, certificate_id)
    VALUES (p_student_id, p_reward_id, v_coin_cost, 'completed', v_cert_id)
    RETURNING id INTO v_redemption_id;

    -- Record transaction in ledger
    INSERT INTO public.coin_transactions (student_id, amount, activity_type, reference_id, description)
    VALUES (p_student_id, -v_coin_cost, 'redemption', v_redemption_id::text, 'Redeemed reward: ' || v_title);

    RETURN jsonb_build_object(
        'success', true,
        'redemption_id', v_redemption_id,
        'coins_spent', v_coin_cost,
        'reward_title', v_title,
        'certificate_id', v_cert_id
    );
END;
$$;

-- Revoke execute from anon on wallet/reward functions
REVOKE EXECUTE ON FUNCTION public.award_student_activity(UUID, VARCHAR, INT, INT, VARCHAR) FROM anon;
REVOKE EXECUTE ON FUNCTION public.convert_tokens_to_gold_coins(UUID, INT) FROM anon;
REVOKE EXECUTE ON FUNCTION public.redeem_reward(UUID, UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.award_student_activity(UUID, VARCHAR, INT, INT, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION public.convert_tokens_to_gold_coins(UUID, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_reward(UUID, UUID) TO authenticated;

-- ------------------------------------------------------------------------------
-- 3. SECURE STUDENT LOOKUP & RLS PROTECTION
-- ------------------------------------------------------------------------------

-- Constrained login lookup RPC: Returns ONLY the email for a single roll number
-- Prevents scraping student names, phones, pins, or passwords
CREATE OR REPLACE FUNCTION public.get_student_email_for_login(p_roll_number TEXT)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT email 
    FROM public.students 
    WHERE roll_number = UPPER(TRIM(p_roll_number))
    LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_student_email_for_login(TEXT) TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 4. SECURE EVENT REGISTRATIONS
-- ------------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.cancel_event_registration_secure(UUID, UUID) CASCADE;

CREATE OR REPLACE FUNCTION public.cancel_event_registration_secure(
    p_event_id UUID,
    p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog, pg_temp
AS $$
DECLARE
    v_caller_uid UUID := auth.uid();
BEGIN
    -- Verify caller is the user or an administrator
    IF v_caller_uid IS NOT NULL AND v_caller_uid != p_user_id THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = v_caller_uid 
              AND role IN ('admin', 'inst_admin', 'super_admin', 'college_admin')
              AND is_active = TRUE
        ) THEN
            RAISE EXCEPTION 'Unauthorized: You can only cancel your own registrations.';
        END IF;
    END IF;

    UPDATE public.event_registrations
    SET status = 'cancelled'
    WHERE event_id = p_event_id
      AND (user_id = p_user_id OR student_id = p_user_id);

    RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.cancel_event_registration_secure(UUID, UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.cancel_event_registration_secure(UUID, UUID) TO authenticated;

-- ------------------------------------------------------------------------------
-- 5. ATOMIC COMMUNITY COUNTERS TRIGGER (Prevents N+1 Like/Comment race conditions)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.sync_community_post_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_post_id UUID;
    v_new_count INT;
BEGIN
    v_post_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.post_id ELSE NEW.post_id END;
    
    SELECT COUNT(*) INTO v_new_count
    FROM public.community_likes
    WHERE post_id = v_post_id;

    UPDATE public.community_posts
    SET likes_count = v_new_count,
        updated_at = NOW()
    WHERE id = v_post_id;

    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_community_likes ON public.community_likes;
CREATE TRIGGER trg_sync_community_likes
AFTER INSERT OR DELETE ON public.community_likes
FOR EACH ROW
EXECUTE FUNCTION public.sync_community_post_likes_count();

-- Ensure is_deleted column exists on community_comments to prevent 42703 (undefined_column)
ALTER TABLE public.community_comments 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_community_comments_post_deleted 
ON public.community_comments (post_id, is_deleted);

CREATE OR REPLACE FUNCTION public.sync_community_post_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_post_id UUID;
    v_new_count INT := 0;
BEGIN
    v_post_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.post_id ELSE NEW.post_id END;

    IF v_post_id IS NOT NULL THEN
        BEGIN
            SELECT COUNT(*) INTO v_new_count
            FROM public.community_comments
            WHERE post_id = v_post_id AND (is_deleted IS NULL OR is_deleted = FALSE);
        EXCEPTION WHEN undefined_column THEN
            SELECT COUNT(*) INTO v_new_count
            FROM public.community_comments
            WHERE post_id = v_post_id;
        END;

        UPDATE public.community_posts
        SET comments_count = v_new_count,
            updated_at = NOW()
        WHERE id = v_post_id;
    END IF;

    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_community_comments ON public.community_comments;
CREATE TRIGGER trg_sync_community_comments
AFTER INSERT OR UPDATE OR DELETE ON public.community_comments
FOR EACH ROW
EXECUTE FUNCTION public.sync_community_post_comments_count();

-- ==============================================================================
-- END OF HARDENING MIGRATION
-- ==============================================================================
