BEGIN;

-- Explore Quiz 26: Phishing & Social Engineering Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000026',
  'Phishing & Social Engineering Challenge Quiz',
  'Test your knowledge on Phishing & Social Engineering with 20 comprehensive questions.',
  'DSA',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000001',
  '00000000-0002-4000-a000-000000000026',
  1,
  'Q1. What is phishing?',
  'credential',
  'sender',
  'phishing',
  'baiting',
  'C',
  'phishing is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000002',
  '00000000-0002-4000-a000-000000000026',
  2,
  'Q2. Which option is most directly associated with social engineering?',
  'report',
  'sender',
  'credential',
  'social engineering',
  'D',
  'social engineering is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000003',
  '00000000-0002-4000-a000-000000000026',
  3,
  'Q3. Which statement best describes spear phishing?',
  'urgency',
  'sender',
  'spear phishing',
  'awareness',
  'C',
  'spear phishing is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000004',
  '00000000-0002-4000-a000-000000000026',
  4,
  'Q4. In this topic, what does smishing refer to?',
  'urgency',
  'social engineering',
  'malware',
  'smishing',
  'D',
  'smishing is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000005',
  '00000000-0002-4000-a000-000000000026',
  5,
  'Q5. What is vishing?',
  'vishing',
  'awareness',
  'credential',
  'sender',
  'A',
  'vishing is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000006',
  '00000000-0002-4000-a000-000000000026',
  6,
  'Q6. Which option is most directly associated with link?',
  'spoofing',
  'link',
  'social engineering',
  'report',
  'B',
  'link is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000007',
  '00000000-0002-4000-a000-000000000026',
  7,
  'Q7. Which statement best describes attachment?',
  'attachment',
  'awareness',
  'domain',
  'link',
  'A',
  'attachment is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000008',
  '00000000-0002-4000-a000-000000000026',
  8,
  'Q8. In this topic, what does urgency refer to?',
  'social engineering',
  'link',
  'verification',
  'urgency',
  'D',
  'urgency is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000009',
  '00000000-0002-4000-a000-000000000026',
  9,
  'Q9. What is impersonation?',
  'pretexting',
  'impersonation',
  'malware',
  'smishing',
  'B',
  'impersonation is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000010',
  '00000000-0002-4000-a000-000000000026',
  10,
  'Q10. Which option is most directly associated with credential?',
  'verification',
  'urgency',
  'spoofing',
  'credential',
  'D',
  'credential is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000011',
  '00000000-0002-4000-a000-000000000026',
  11,
  'Q11. Which statement best describes MFA?',
  'MFA',
  'sender',
  'social engineering',
  'baiting',
  'A',
  'MFA is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000012',
  '00000000-0002-4000-a000-000000000026',
  12,
  'Q12. In this topic, what does verification refer to?',
  'pretexting',
  'report',
  'malware',
  'verification',
  'D',
  'verification is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000013',
  '00000000-0002-4000-a000-000000000026',
  13,
  'Q13. What is sender?',
  'sender',
  'report',
  'attachment',
  'social engineering',
  'A',
  'sender is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000014',
  '00000000-0002-4000-a000-000000000026',
  14,
  'Q14. Which option is most directly associated with domain?',
  'awareness',
  'domain',
  'baiting',
  'credential',
  'B',
  'domain is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000015',
  '00000000-0002-4000-a000-000000000026',
  15,
  'Q15. Which statement best describes spoofing?',
  'domain',
  'vishing',
  'MFA',
  'spoofing',
  'D',
  'spoofing is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000016',
  '00000000-0002-4000-a000-000000000026',
  16,
  'Q16. What is phishing?',
  'spoofing',
  'phishing',
  'social engineering',
  'verification',
  'B',
  'phishing is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000017',
  '00000000-0002-4000-a000-000000000026',
  17,
  'Q17. Which option is most directly associated with social engineering?',
  'social engineering',
  'report',
  'vishing',
  'MFA',
  'A',
  'social engineering is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000018',
  '00000000-0002-4000-a000-000000000026',
  18,
  'Q18. Which statement best describes spear phishing?',
  'vishing',
  'social engineering',
  'spear phishing',
  'credential',
  'C',
  'spear phishing is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000019',
  '00000000-0002-4000-a000-000000000026',
  19,
  'Q19. In this topic, what does smishing refer to?',
  'phishing',
  'report',
  'spear phishing',
  'smishing',
  'D',
  'smishing is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000026000020',
  '00000000-0002-4000-a000-000000000026',
  20,
  'Q20. What is vishing?',
  'spoofing',
  'report',
  'social engineering',
  'vishing',
  'D',
  'vishing is a key concept in Phishing & Social Engineering.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 27: Firewalls Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000027',
  'Firewalls Challenge Quiz',
  'Test your knowledge on Firewalls with 20 comprehensive questions.',
  'Programming',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000001',
  '00000000-0002-4000-a000-000000000027',
  1,
  'Q1. What is firewall?',
  'IP',
  'stateful',
  'DMZ',
  'firewall',
  'D',
  'firewall is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000002',
  '00000000-0002-4000-a000-000000000027',
  2,
  'Q2. Which option is most directly associated with traffic?',
  'port',
  'network',
  'traffic',
  'security',
  'C',
  'traffic is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000003',
  '00000000-0002-4000-a000-000000000027',
  3,
  'Q3. Which statement best describes rule?',
  'allow',
  'DMZ',
  'rule',
  'security',
  'C',
  'rule is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000004',
  '00000000-0002-4000-a000-000000000027',
  4,
  'Q4. In this topic, what does packet refer to?',
  'packet',
  'security',
  'stateful',
  'host firewall',
  'A',
  'packet is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000005',
  '00000000-0002-4000-a000-000000000027',
  5,
  'Q5. What is stateful?',
  'network',
  'stateful',
  'stateless',
  'DMZ',
  'B',
  'stateful is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000006',
  '00000000-0002-4000-a000-000000000027',
  6,
  'Q6. Which option is most directly associated with stateless?',
  'stateless',
  'stateful',
  'host firewall',
  'ACL',
  'A',
  'stateless is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000007',
  '00000000-0002-4000-a000-000000000027',
  7,
  'Q7. Which statement best describes inbound?',
  'ACL',
  'deny',
  'logging',
  'inbound',
  'D',
  'inbound is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000008',
  '00000000-0002-4000-a000-000000000027',
  8,
  'Q8. In this topic, what does outbound refer to?',
  'deny',
  'outbound',
  'ACL',
  'proxy',
  'B',
  'outbound is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000009',
  '00000000-0002-4000-a000-000000000027',
  9,
  'Q9. What is port?',
  'inbound',
  'network',
  'port',
  'rule',
  'C',
  'port is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000010',
  '00000000-0002-4000-a000-000000000027',
  10,
  'Q10. Which option is most directly associated with IP?',
  'rule',
  'inbound',
  'IP',
  'logging',
  'C',
  'IP is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000011',
  '00000000-0002-4000-a000-000000000027',
  11,
  'Q11. Which statement best describes allow?',
  'allow',
  'outbound',
  'traffic',
  'ACL',
  'A',
  'allow is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000012',
  '00000000-0002-4000-a000-000000000027',
  12,
  'Q12. In this topic, what does deny refer to?',
  'deny',
  'traffic',
  'stateless',
  'network',
  'A',
  'deny is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000013',
  '00000000-0002-4000-a000-000000000027',
  13,
  'Q13. What is network?',
  'firewall',
  'security',
  'network',
  'host firewall',
  'C',
  'network is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000014',
  '00000000-0002-4000-a000-000000000027',
  14,
  'Q14. Which option is most directly associated with host firewall?',
  'stateless',
  'filter',
  'host firewall',
  'deny',
  'C',
  'host firewall is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000015',
  '00000000-0002-4000-a000-000000000027',
  15,
  'Q15. Which statement best describes proxy?',
  'inbound',
  'proxy',
  'stateful',
  'network',
  'B',
  'proxy is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000016',
  '00000000-0002-4000-a000-000000000027',
  16,
  'Q16. What is firewall?',
  'security',
  'firewall',
  'proxy',
  'DMZ',
  'B',
  'firewall is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000017',
  '00000000-0002-4000-a000-000000000027',
  17,
  'Q17. Which option is most directly associated with traffic?',
  'filter',
  'DMZ',
  'stateless',
  'traffic',
  'D',
  'traffic is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000018',
  '00000000-0002-4000-a000-000000000027',
  18,
  'Q18. Which statement best describes rule?',
  'logging',
  'rule',
  'outbound',
  'traffic',
  'B',
  'rule is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000019',
  '00000000-0002-4000-a000-000000000027',
  19,
  'Q19. In this topic, what does packet refer to?',
  'packet',
  'logging',
  'DMZ',
  'filter',
  'A',
  'packet is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000027000020',
  '00000000-0002-4000-a000-000000000027',
  20,
  'Q20. What is stateful?',
  'stateful',
  'rule',
  'deny',
  'outbound',
  'A',
  'stateful is a key concept in Firewalls.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 28: VPNs Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000028',
  'VPNs Challenge Quiz',
  'Test your knowledge on VPNs with 20 comprehensive questions.',
  'Software Eng',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000001',
  '00000000-0002-4000-a000-000000000028',
  1,
  'Q1. What is VPN?',
  'client',
  'security',
  'privacy',
  'VPN',
  'D',
  'VPN is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000002',
  '00000000-0002-4000-a000-000000000028',
  2,
  'Q2. Which option is most directly associated with encrypted tunnel?',
  'encrypted tunnel',
  'authentication',
  'remote access',
  'routing',
  'A',
  'encrypted tunnel is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000003',
  '00000000-0002-4000-a000-000000000028',
  3,
  'Q3. Which statement best describes VPN server?',
  'DNS',
  'split tunneling',
  'VPN server',
  'security',
  'C',
  'VPN server is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000004',
  '00000000-0002-4000-a000-000000000028',
  4,
  'Q4. In this topic, what does client refer to?',
  'VPN',
  'security',
  'DNS',
  'client',
  'D',
  'client is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000005',
  '00000000-0002-4000-a000-000000000028',
  5,
  'Q5. What is IP address?',
  'remote access',
  'ISP',
  'security',
  'IP address',
  'D',
  'IP address is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000006',
  '00000000-0002-4000-a000-000000000028',
  6,
  'Q6. Which option is most directly associated with public Wi-Fi?',
  'DNS',
  'public Wi-Fi',
  'ISP',
  'endpoint',
  'B',
  'public Wi-Fi is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000007',
  '00000000-0002-4000-a000-000000000028',
  7,
  'Q7. Which statement best describes encryption?',
  'routing',
  'encryption',
  'limitations',
  'site-to-site',
  'B',
  'encryption is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000008',
  '00000000-0002-4000-a000-000000000028',
  8,
  'Q8. In this topic, what does privacy refer to?',
  'public Wi-Fi',
  'privacy',
  'VPN server',
  'routing',
  'B',
  'privacy is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000009',
  '00000000-0002-4000-a000-000000000028',
  9,
  'Q9. What is routing?',
  'routing',
  'IP address',
  'split tunneling',
  'limitations',
  'A',
  'routing is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000010',
  '00000000-0002-4000-a000-000000000028',
  10,
  'Q10. Which option is most directly associated with endpoint?',
  'ISP',
  'IP address',
  'remote access',
  'endpoint',
  'D',
  'endpoint is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000011',
  '00000000-0002-4000-a000-000000000028',
  11,
  'Q11. Which statement best describes protocol?',
  'IP address',
  'split tunneling',
  'remote access',
  'protocol',
  'D',
  'protocol is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000012',
  '00000000-0002-4000-a000-000000000028',
  12,
  'Q12. In this topic, what does remote access refer to?',
  'ISP',
  'remote access',
  'client',
  'encryption',
  'B',
  'remote access is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000013',
  '00000000-0002-4000-a000-000000000028',
  13,
  'Q13. What is site-to-site?',
  'client',
  'routing',
  'site-to-site',
  'ISP',
  'C',
  'site-to-site is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000014',
  '00000000-0002-4000-a000-000000000028',
  14,
  'Q14. Which option is most directly associated with split tunneling?',
  'authentication',
  'split tunneling',
  'public Wi-Fi',
  'encryption',
  'B',
  'split tunneling is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000015',
  '00000000-0002-4000-a000-000000000028',
  15,
  'Q15. Which statement best describes traffic?',
  'encryption',
  'traffic',
  'ISP',
  'public Wi-Fi',
  'B',
  'traffic is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000016',
  '00000000-0002-4000-a000-000000000028',
  16,
  'Q16. What is VPN?',
  'encrypted tunnel',
  'VPN',
  'authentication',
  'client',
  'B',
  'VPN is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000017',
  '00000000-0002-4000-a000-000000000028',
  17,
  'Q17. Which option is most directly associated with encrypted tunnel?',
  'client',
  'encrypted tunnel',
  'public Wi-Fi',
  'split tunneling',
  'B',
  'encrypted tunnel is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000018',
  '00000000-0002-4000-a000-000000000028',
  18,
  'Q18. Which statement best describes VPN server?',
  'authentication',
  'VPN server',
  'DNS',
  'ISP',
  'B',
  'VPN server is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000019',
  '00000000-0002-4000-a000-000000000028',
  19,
  'Q19. In this topic, what does client refer to?',
  'traffic',
  'VPN server',
  'client',
  'routing',
  'C',
  'client is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000028000020',
  '00000000-0002-4000-a000-000000000028',
  20,
  'Q20. What is IP address?',
  'traffic',
  'limitations',
  'remote access',
  'IP address',
  'D',
  'IP address is a key concept in VPNs.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 29: Ethical Hacking Basics Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000029',
  'Ethical Hacking Basics Challenge Quiz',
  'Test your knowledge on Ethical Hacking Basics with 20 comprehensive questions.',
  'Backend',
  'CSE',
  'Advanced',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000001',
  '00000000-0002-4000-a000-000000000029',
  1,
  'Q1. What is ethical hacking?',
  'evidence',
  'ethical hacking',
  'verification',
  'scan',
  'B',
  'ethical hacking is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000002',
  '00000000-0002-4000-a000-000000000029',
  2,
  'Q2. Which option is most directly associated with authorization?',
  'authorization',
  'responsible disclosure',
  'permission',
  'verification',
  'A',
  'authorization is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000003',
  '00000000-0002-4000-a000-000000000029',
  3,
  'Q3. Which statement best describes scope?',
  'scope',
  'vulnerability',
  'risk',
  'remediation',
  'A',
  'scope is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000004',
  '00000000-0002-4000-a000-000000000029',
  4,
  'Q4. In this topic, what does vulnerability refer to?',
  'authorization',
  'vulnerability',
  'report',
  'risk',
  'B',
  'vulnerability is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000005',
  '00000000-0002-4000-a000-000000000029',
  5,
  'Q5. What is penetration test?',
  'vulnerability',
  'responsible disclosure',
  'penetration test',
  'authorization',
  'C',
  'penetration test is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000006',
  '00000000-0002-4000-a000-000000000029',
  6,
  'Q6. Which option is most directly associated with reconnaissance?',
  'reconnaissance',
  'responsible disclosure',
  'vulnerability',
  'rules of engagement',
  'A',
  'reconnaissance is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000007',
  '00000000-0002-4000-a000-000000000029',
  7,
  'Q7. Which statement best describes scan?',
  'scan',
  'responsible disclosure',
  'rules of engagement',
  'ethical hacking',
  'A',
  'scan is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000008',
  '00000000-0002-4000-a000-000000000029',
  8,
  'Q8. In this topic, what does exploit refer to?',
  'reconnaissance',
  'vulnerability',
  'asset',
  'exploit',
  'D',
  'exploit is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000009',
  '00000000-0002-4000-a000-000000000029',
  9,
  'Q9. What is evidence?',
  'penetration test',
  'verification',
  'scope',
  'evidence',
  'D',
  'evidence is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000010',
  '00000000-0002-4000-a000-000000000029',
  10,
  'Q10. Which option is most directly associated with report?',
  'authorization',
  'evidence',
  'report',
  'risk',
  'C',
  'report is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000011',
  '00000000-0002-4000-a000-000000000029',
  11,
  'Q11. Which statement best describes remediation?',
  'remediation',
  'asset',
  'security tester',
  'severity',
  'A',
  'remediation is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000012',
  '00000000-0002-4000-a000-000000000029',
  12,
  'Q12. In this topic, what does responsible disclosure refer to?',
  'scope',
  'security tester',
  'report',
  'responsible disclosure',
  'D',
  'responsible disclosure is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000013',
  '00000000-0002-4000-a000-000000000029',
  13,
  'Q13. What is rules of engagement?',
  'responsible disclosure',
  'vulnerability',
  'rules of engagement',
  'asset',
  'C',
  'rules of engagement is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000014',
  '00000000-0002-4000-a000-000000000029',
  14,
  'Q14. Which option is most directly associated with asset?',
  'remediation',
  'reconnaissance',
  'asset',
  'security tester',
  'C',
  'asset is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000015',
  '00000000-0002-4000-a000-000000000029',
  15,
  'Q15. Which statement best describes risk?',
  'risk',
  'report',
  'severity',
  'evidence',
  'A',
  'risk is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000016',
  '00000000-0002-4000-a000-000000000029',
  16,
  'Q16. What is ethical hacking?',
  'verification',
  'ethical hacking',
  'vulnerability',
  'penetration test',
  'B',
  'ethical hacking is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000017',
  '00000000-0002-4000-a000-000000000029',
  17,
  'Q17. Which option is most directly associated with authorization?',
  'risk',
  'permission',
  'security tester',
  'authorization',
  'D',
  'authorization is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000018',
  '00000000-0002-4000-a000-000000000029',
  18,
  'Q18. Which statement best describes scope?',
  'report',
  'logging',
  'scope',
  'scan',
  'C',
  'scope is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000019',
  '00000000-0002-4000-a000-000000000029',
  19,
  'Q19. In this topic, what does vulnerability refer to?',
  'vulnerability',
  'remediation',
  'rules of engagement',
  'penetration test',
  'A',
  'vulnerability is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000029000020',
  '00000000-0002-4000-a000-000000000029',
  20,
  'Q20. What is penetration test?',
  'evidence',
  'penetration test',
  'responsible disclosure',
  'logging',
  'B',
  'penetration test is a key concept in Ethical Hacking Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 30: DevOps Basics Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000030',
  'DevOps Basics Challenge Quiz',
  'Test your knowledge on DevOps Basics with 20 comprehensive questions.',
  'Backend',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000001',
  '00000000-0002-4000-a000-000000000030',
  1,
  'Q1. What is DevOps?',
  'release',
  'feedback',
  'DevOps',
  'infrastructure',
  'C',
  'DevOps is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000002',
  '00000000-0002-4000-a000-000000000030',
  2,
  'Q2. Which option is most directly associated with development?',
  'monitoring',
  'version control',
  'CD',
  'development',
  'D',
  'development is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000003',
  '00000000-0002-4000-a000-000000000030',
  3,
  'Q3. Which statement best describes operations?',
  'version control',
  'DevOps',
  'culture',
  'operations',
  'D',
  'operations is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000004',
  '00000000-0002-4000-a000-000000000030',
  4,
  'Q4. In this topic, what does automation refer to?',
  'operations',
  'release',
  'version control',
  'automation',
  'D',
  'automation is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000005',
  '00000000-0002-4000-a000-000000000030',
  5,
  'Q5. What is CI?',
  'configuration',
  'feedback',
  'CI',
  'release',
  'C',
  'CI is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000006',
  '00000000-0002-4000-a000-000000000030',
  6,
  'Q6. Which option is most directly associated with CD?',
  'configuration',
  'development',
  'CD',
  'testing',
  'C',
  'CD is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000007',
  '00000000-0002-4000-a000-000000000030',
  7,
  'Q7. Which statement best describes deployment?',
  'infrastructure',
  'deployment',
  'containers',
  'monitoring',
  'B',
  'deployment is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000008',
  '00000000-0002-4000-a000-000000000030',
  8,
  'Q8. In this topic, what does monitoring refer to?',
  'monitoring',
  'CD',
  'deployment',
  'pipeline',
  'A',
  'monitoring is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000009',
  '00000000-0002-4000-a000-000000000030',
  9,
  'Q9. What is collaboration?',
  'feedback',
  'collaboration',
  'pipeline',
  'reliability',
  'B',
  'collaboration is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000010',
  '00000000-0002-4000-a000-000000000030',
  10,
  'Q10. Which option is most directly associated with version control?',
  'observability',
  'version control',
  'CD',
  'collaboration',
  'B',
  'version control is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000011',
  '00000000-0002-4000-a000-000000000030',
  11,
  'Q11. Which statement best describes infrastructure?',
  'observability',
  'automation',
  'infrastructure',
  'testing',
  'C',
  'infrastructure is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000012',
  '00000000-0002-4000-a000-000000000030',
  12,
  'Q12. In this topic, what does testing refer to?',
  'monitoring',
  'operations',
  'version control',
  'testing',
  'D',
  'testing is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000013',
  '00000000-0002-4000-a000-000000000030',
  13,
  'Q13. What is pipeline?',
  'monitoring',
  'pipeline',
  'deployment',
  'automation',
  'B',
  'pipeline is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000014',
  '00000000-0002-4000-a000-000000000030',
  14,
  'Q14. Which option is most directly associated with feedback?',
  'observability',
  'feedback',
  'collaboration',
  'reliability',
  'B',
  'feedback is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000015',
  '00000000-0002-4000-a000-000000000030',
  15,
  'Q15. Which statement best describes release?',
  'collaboration',
  'release',
  'version control',
  'CD',
  'B',
  'release is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000016',
  '00000000-0002-4000-a000-000000000030',
  16,
  'Q16. What is DevOps?',
  'infrastructure',
  'development',
  'collaboration',
  'DevOps',
  'D',
  'DevOps is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000017',
  '00000000-0002-4000-a000-000000000030',
  17,
  'Q17. Which option is most directly associated with development?',
  'development',
  'CI',
  'observability',
  'CD',
  'A',
  'development is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000018',
  '00000000-0002-4000-a000-000000000030',
  18,
  'Q18. Which statement best describes operations?',
  'automation',
  'operations',
  'infrastructure',
  'pipeline',
  'B',
  'operations is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000019',
  '00000000-0002-4000-a000-000000000030',
  19,
  'Q19. In this topic, what does automation refer to?',
  'containers',
  'configuration',
  'automation',
  'deployment',
  'C',
  'automation is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000030000020',
  '00000000-0002-4000-a000-000000000030',
  20,
  'Q20. What is CI?',
  'development',
  'collaboration',
  'CD',
  'CI',
  'D',
  'CI is a key concept in DevOps Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 31: CI/CD Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000031',
  'CI/CD Challenge Quiz',
  'Test your knowledge on CI/CD with 20 comprehensive questions.',
  'Architecture',
  'CSE',
  'Advanced',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000001',
  '00000000-0002-4000-a000-000000000031',
  1,
  'Q1. What is continuous integration?',
  'continuous integration',
  'integration test',
  'repository',
  'artifact',
  'A',
  'continuous integration is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000002',
  '00000000-0002-4000-a000-000000000031',
  2,
  'Q2. Which option is most directly associated with continuous delivery?',
  'merge',
  'continuous delivery',
  'production',
  'automation',
  'B',
  'continuous delivery is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000003',
  '00000000-0002-4000-a000-000000000031',
  3,
  'Q3. Which statement best describes continuous deployment?',
  'continuous integration',
  'continuous deployment',
  'repository',
  'quality gate',
  'B',
  'continuous deployment is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000004',
  '00000000-0002-4000-a000-000000000031',
  4,
  'Q4. In this topic, what does pipeline refer to?',
  'commit',
  'pipeline',
  'integration test',
  'feedback',
  'B',
  'pipeline is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000005',
  '00000000-0002-4000-a000-000000000031',
  5,
  'Q5. What is build?',
  'artifact',
  'integration test',
  'build',
  'quality gate',
  'C',
  'build is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000006',
  '00000000-0002-4000-a000-000000000031',
  6,
  'Q6. Which option is most directly associated with test?',
  'quality gate',
  'test',
  'deploy',
  'release',
  'B',
  'test is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000007',
  '00000000-0002-4000-a000-000000000031',
  7,
  'Q7. Which statement best describes deploy?',
  'quality gate',
  'build',
  'deploy',
  'test',
  'C',
  'deploy is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000008',
  '00000000-0002-4000-a000-000000000031',
  8,
  'Q8. In this topic, what does automation refer to?',
  'automation',
  'production',
  'continuous delivery',
  'deploy',
  'A',
  'automation is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000009',
  '00000000-0002-4000-a000-000000000031',
  9,
  'Q9. What is commit?',
  'continuous integration',
  'commit',
  'deploy',
  'unit test',
  'B',
  'commit is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000010',
  '00000000-0002-4000-a000-000000000031',
  10,
  'Q10. Which option is most directly associated with merge?',
  'merge',
  'feedback',
  'continuous integration',
  'unit test',
  'A',
  'merge is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000011',
  '00000000-0002-4000-a000-000000000031',
  11,
  'Q11. Which statement best describes artifact?',
  'merge',
  'artifact',
  'commit',
  'repository',
  'B',
  'artifact is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000012',
  '00000000-0002-4000-a000-000000000031',
  12,
  'Q12. In this topic, what does staging refer to?',
  'continuous deployment',
  'automation',
  'staging',
  'unit test',
  'C',
  'staging is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000013',
  '00000000-0002-4000-a000-000000000031',
  13,
  'Q13. What is production?',
  'production',
  'deploy',
  'unit test',
  'repository',
  'A',
  'production is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000014',
  '00000000-0002-4000-a000-000000000031',
  14,
  'Q14. Which option is most directly associated with rollback?',
  'staging',
  'rollback',
  'feedback',
  'continuous integration',
  'B',
  'rollback is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000015',
  '00000000-0002-4000-a000-000000000031',
  15,
  'Q15. Which statement best describes quality gate?',
  'build',
  'staging',
  'quality gate',
  'rollback',
  'C',
  'quality gate is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000016',
  '00000000-0002-4000-a000-000000000031',
  16,
  'Q16. What is continuous integration?',
  'rollback',
  'continuous integration',
  'production',
  'release',
  'B',
  'continuous integration is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000017',
  '00000000-0002-4000-a000-000000000031',
  17,
  'Q17. Which option is most directly associated with continuous delivery?',
  'production',
  'continuous delivery',
  'pipeline',
  'integration test',
  'B',
  'continuous delivery is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000018',
  '00000000-0002-4000-a000-000000000031',
  18,
  'Q18. Which statement best describes continuous deployment?',
  'unit test',
  'continuous integration',
  'continuous deployment',
  'staging',
  'C',
  'continuous deployment is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000019',
  '00000000-0002-4000-a000-000000000031',
  19,
  'Q19. In this topic, what does pipeline refer to?',
  'feedback',
  'pipeline',
  'integration test',
  'test',
  'B',
  'pipeline is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000031000020',
  '00000000-0002-4000-a000-000000000031',
  20,
  'Q20. What is build?',
  'continuous delivery',
  'artifact',
  'build',
  'test',
  'C',
  'build is a key concept in CI/CD.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 32: Docker Basics Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000032',
  'Docker Basics Challenge Quiz',
  'Test your knowledge on Docker Basics with 20 comprehensive questions.',
  'DevOps',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000001',
  '00000000-0002-4000-a000-000000000032',
  1,
  'Q1. What is Docker?',
  'build',
  'run',
  'volume',
  'Docker',
  'D',
  'Docker is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000002',
  '00000000-0002-4000-a000-000000000032',
  2,
  'Q2. Which option is most directly associated with container?',
  'container',
  'tag',
  'Compose',
  'build',
  'A',
  'container is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000003',
  '00000000-0002-4000-a000-000000000032',
  3,
  'Q3. Which statement best describes image?',
  'volume',
  'dependency',
  'image',
  'push',
  'C',
  'image is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000004',
  '00000000-0002-4000-a000-000000000032',
  4,
  'Q4. In this topic, what does Dockerfile refer to?',
  'Dockerfile',
  'network',
  'Docker',
  'image',
  'A',
  'Dockerfile is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000005',
  '00000000-0002-4000-a000-000000000032',
  5,
  'Q5. What is registry?',
  'registry',
  'container runtime',
  'port mapping',
  'layer',
  'A',
  'registry is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000006',
  '00000000-0002-4000-a000-000000000032',
  6,
  'Q6. Which option is most directly associated with container runtime?',
  'Compose',
  'Dockerfile',
  'build',
  'container runtime',
  'D',
  'container runtime is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000007',
  '00000000-0002-4000-a000-000000000032',
  7,
  'Q7. Which statement best describes port mapping?',
  'container',
  'isolation',
  'port mapping',
  'push',
  'C',
  'port mapping is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000008',
  '00000000-0002-4000-a000-000000000032',
  8,
  'Q8. In this topic, what does volume refer to?',
  'push',
  'port mapping',
  'network',
  'volume',
  'D',
  'volume is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000009',
  '00000000-0002-4000-a000-000000000032',
  9,
  'Q9. What is network?',
  'image',
  'host kernel',
  'network',
  'tag',
  'C',
  'network is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000010',
  '00000000-0002-4000-a000-000000000032',
  10,
  'Q10. Which option is most directly associated with layer?',
  'layer',
  'tag',
  'Dockerfile',
  'containerization',
  'A',
  'layer is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000011',
  '00000000-0002-4000-a000-000000000032',
  11,
  'Q11. Which statement best describes build?',
  'volume',
  'tag',
  'build',
  'port mapping',
  'C',
  'build is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000012',
  '00000000-0002-4000-a000-000000000032',
  12,
  'Q12. In this topic, what does run refer to?',
  'run',
  'image',
  'port mapping',
  'layer',
  'A',
  'run is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000013',
  '00000000-0002-4000-a000-000000000032',
  13,
  'Q13. What is pull?',
  'Compose',
  'pull',
  'Dockerfile',
  'build',
  'B',
  'pull is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000014',
  '00000000-0002-4000-a000-000000000032',
  14,
  'Q14. Which option is most directly associated with push?',
  'push',
  'build',
  'isolation',
  'port mapping',
  'A',
  'push is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000015',
  '00000000-0002-4000-a000-000000000032',
  15,
  'Q15. Which statement best describes tag?',
  'port mapping',
  'run',
  'tag',
  'registry',
  'C',
  'tag is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000016',
  '00000000-0002-4000-a000-000000000032',
  16,
  'Q16. What is Docker?',
  'isolation',
  'registry',
  'Docker',
  'pull',
  'C',
  'Docker is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000017',
  '00000000-0002-4000-a000-000000000032',
  17,
  'Q17. Which option is most directly associated with container?',
  'layer',
  'run',
  'container',
  'host kernel',
  'C',
  'container is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000018',
  '00000000-0002-4000-a000-000000000032',
  18,
  'Q18. Which statement best describes image?',
  'image',
  'container runtime',
  'Compose',
  'dependency',
  'A',
  'image is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000019',
  '00000000-0002-4000-a000-000000000032',
  19,
  'Q19. In this topic, what does Dockerfile refer to?',
  'Docker',
  'image',
  'registry',
  'Dockerfile',
  'D',
  'Dockerfile is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000032000020',
  '00000000-0002-4000-a000-000000000032',
  20,
  'Q20. What is registry?',
  'tag',
  'Dockerfile',
  'port mapping',
  'registry',
  'D',
  'registry is a key concept in Docker Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 33: Software Development Life Cycle Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000033',
  'Software Development Life Cycle Challenge Quiz',
  'Test your knowledge on Software Development Life Cycle with 20 comprehensive questions.',
  'AI',
  'AI & ML',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000001',
  '00000000-0002-4000-a000-000000000033',
  1,
  'Q1. What is requirements?',
  'feedback',
  'testing',
  'requirements',
  'lifecycle',
  'C',
  'requirements is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000002',
  '00000000-0002-4000-a000-000000000033',
  2,
  'Q2. Which option is most directly associated with planning?',
  'requirements',
  'maintenance',
  'lifecycle',
  'planning',
  'D',
  'planning is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000003',
  '00000000-0002-4000-a000-000000000033',
  3,
  'Q3. Which statement best describes design?',
  'SDLC',
  'lifecycle',
  'design',
  'architecture',
  'C',
  'design is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000004',
  '00000000-0002-4000-a000-000000000033',
  4,
  'Q4. In this topic, what does development refer to?',
  'stakeholder',
  'release',
  'iteration',
  'development',
  'D',
  'development is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000005',
  '00000000-0002-4000-a000-000000000033',
  5,
  'Q5. What is testing?',
  'lifecycle',
  'release',
  'testing',
  'documentation',
  'C',
  'testing is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000006',
  '00000000-0002-4000-a000-000000000033',
  6,
  'Q6. Which option is most directly associated with deployment?',
  'architecture',
  'requirements',
  'waterfall',
  'deployment',
  'D',
  'deployment is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000007',
  '00000000-0002-4000-a000-000000000033',
  7,
  'Q7. Which statement best describes maintenance?',
  'lifecycle',
  'agile',
  'feedback',
  'maintenance',
  'D',
  'maintenance is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000008',
  '00000000-0002-4000-a000-000000000033',
  8,
  'Q8. In this topic, what does SDLC refer to?',
  'SDLC',
  'requirements',
  'quality',
  'design',
  'A',
  'SDLC is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000009',
  '00000000-0002-4000-a000-000000000033',
  9,
  'Q9. What is stakeholder?',
  'waterfall',
  'quality',
  'agile',
  'stakeholder',
  'D',
  'stakeholder is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000010',
  '00000000-0002-4000-a000-000000000033',
  10,
  'Q10. Which option is most directly associated with prototype?',
  'requirements',
  'documentation',
  'prototype',
  'architecture',
  'C',
  'prototype is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000011',
  '00000000-0002-4000-a000-000000000033',
  11,
  'Q11. Which statement best describes architecture?',
  'architecture',
  'release',
  'lifecycle',
  'development',
  'A',
  'architecture is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000012',
  '00000000-0002-4000-a000-000000000033',
  12,
  'Q12. In this topic, what does bug refer to?',
  'prototype',
  'bug',
  'feedback',
  'agile',
  'B',
  'bug is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000013',
  '00000000-0002-4000-a000-000000000033',
  13,
  'Q13. What is release?',
  'waterfall',
  'architecture',
  'release',
  'iteration',
  'C',
  'release is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000014',
  '00000000-0002-4000-a000-000000000033',
  14,
  'Q14. Which option is most directly associated with documentation?',
  'documentation',
  'prototype',
  'iteration',
  'requirements',
  'A',
  'documentation is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000015',
  '00000000-0002-4000-a000-000000000033',
  15,
  'Q15. Which statement best describes iteration?',
  'bug',
  'iteration',
  'prototype',
  'feedback',
  'B',
  'iteration is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000016',
  '00000000-0002-4000-a000-000000000033',
  16,
  'Q16. What is requirements?',
  'waterfall',
  'requirements',
  'architecture',
  'prototype',
  'B',
  'requirements is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000017',
  '00000000-0002-4000-a000-000000000033',
  17,
  'Q17. Which option is most directly associated with planning?',
  'feedback',
  'architecture',
  'requirements',
  'planning',
  'D',
  'planning is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000018',
  '00000000-0002-4000-a000-000000000033',
  18,
  'Q18. Which statement best describes design?',
  'design',
  'documentation',
  'waterfall',
  'iteration',
  'A',
  'design is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000019',
  '00000000-0002-4000-a000-000000000033',
  19,
  'Q19. In this topic, what does development refer to?',
  'testing',
  'lifecycle',
  'prototype',
  'development',
  'D',
  'development is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000033000020',
  '00000000-0002-4000-a000-000000000033',
  20,
  'Q20. What is testing?',
  'maintenance',
  'testing',
  'agile',
  'architecture',
  'B',
  'testing is a key concept in Software Development Life Cycle.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 34: Debugging & Error Handling Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000034',
  'Debugging & Error Handling Challenge Quiz',
  'Test your knowledge on Debugging & Error Handling with 20 comprehensive questions.',
  'ML',
  'AI & ML',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000001',
  '00000000-0002-4000-a000-000000000034',
  1,
  'Q1. What is debugging?',
  'monitoring',
  'regression',
  'failure',
  'debugging',
  'D',
  'debugging is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000002',
  '00000000-0002-4000-a000-000000000034',
  2,
  'Q2. Which option is most directly associated with bug?',
  'reproduce',
  'bug',
  'failure',
  'regression',
  'B',
  'bug is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000003',
  '00000000-0002-4000-a000-000000000034',
  3,
  'Q3. Which statement best describes error?',
  'breakpoint',
  'error',
  'regression',
  'debugging',
  'B',
  'error is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000004',
  '00000000-0002-4000-a000-000000000034',
  4,
  'Q4. In this topic, what does exception refer to?',
  'exception',
  'failure',
  'try/catch',
  'handling',
  'A',
  'exception is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000005',
  '00000000-0002-4000-a000-000000000034',
  5,
  'Q5. What is log?',
  'debugging',
  'log',
  'validation',
  'try/catch',
  'B',
  'log is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000006',
  '00000000-0002-4000-a000-000000000034',
  6,
  'Q6. Which option is most directly associated with stack trace?',
  'stack trace',
  'regression',
  'handling',
  'input',
  'A',
  'stack trace is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000007',
  '00000000-0002-4000-a000-000000000034',
  7,
  'Q7. Which statement best describes breakpoint?',
  'bug',
  'log',
  'exception',
  'breakpoint',
  'D',
  'breakpoint is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000008',
  '00000000-0002-4000-a000-000000000034',
  8,
  'Q8. In this topic, what does test refer to?',
  'validation',
  'test',
  'input',
  'error',
  'B',
  'test is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000009',
  '00000000-0002-4000-a000-000000000034',
  9,
  'Q9. What is reproduce?',
  'verification',
  'stack trace',
  'reproduce',
  'log',
  'C',
  'reproduce is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000010',
  '00000000-0002-4000-a000-000000000034',
  10,
  'Q10. Which option is most directly associated with root cause?',
  'root cause',
  'assertion',
  'exception',
  'reproduce',
  'A',
  'root cause is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000011',
  '00000000-0002-4000-a000-000000000034',
  11,
  'Q11. Which statement best describes validation?',
  'reproduce',
  'fix',
  'validation',
  'error',
  'C',
  'validation is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000012',
  '00000000-0002-4000-a000-000000000034',
  12,
  'Q12. In this topic, what does try/catch refer to?',
  'breakpoint',
  'monitoring',
  'try/catch',
  'reproduce',
  'C',
  'try/catch is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000013',
  '00000000-0002-4000-a000-000000000034',
  13,
  'Q13. What is input?',
  'input',
  'handling',
  'log',
  'bug',
  'A',
  'input is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000014',
  '00000000-0002-4000-a000-000000000034',
  14,
  'Q14. Which option is most directly associated with failure?',
  'failure',
  'test',
  'debugging',
  'bug',
  'A',
  'failure is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000015',
  '00000000-0002-4000-a000-000000000034',
  15,
  'Q15. Which statement best describes handling?',
  'stack trace',
  'handling',
  'test',
  'input',
  'B',
  'handling is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000016',
  '00000000-0002-4000-a000-000000000034',
  16,
  'Q16. What is debugging?',
  'debugging',
  'handling',
  'assertion',
  'verification',
  'A',
  'debugging is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000017',
  '00000000-0002-4000-a000-000000000034',
  17,
  'Q17. Which option is most directly associated with bug?',
  'bug',
  'handling',
  'root cause',
  'debugging',
  'A',
  'bug is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000018',
  '00000000-0002-4000-a000-000000000034',
  18,
  'Q18. Which statement best describes error?',
  'reproduce',
  'debugging',
  'fix',
  'error',
  'D',
  'error is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000019',
  '00000000-0002-4000-a000-000000000034',
  19,
  'Q19. In this topic, what does exception refer to?',
  'bug',
  'exception',
  'test',
  'handling',
  'B',
  'exception is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000034000020',
  '00000000-0002-4000-a000-000000000034',
  20,
  'Q20. What is log?',
  'regression',
  'test',
  'breakpoint',
  'log',
  'D',
  'log is a key concept in Debugging & Error Handling.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 35: Data Structures Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000035',
  'Data Structures Challenge Quiz',
  'Test your knowledge on Data Structures with 20 comprehensive questions.',
  'AI',
  'AI & ML',
  'Advanced',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000001',
  '00000000-0002-4000-a000-000000000035',
  1,
  'Q1. What is array?',
  'tree',
  'index',
  'array',
  'hash table',
  'C',
  'array is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000002',
  '00000000-0002-4000-a000-000000000035',
  2,
  'Q2. Which option is most directly associated with linked list?',
  'graph',
  'traversal',
  'linked list',
  'stack',
  'C',
  'linked list is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000003',
  '00000000-0002-4000-a000-000000000035',
  3,
  'Q3. Which statement best describes stack?',
  'complexity',
  'stack',
  'index',
  'array',
  'B',
  'stack is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000004',
  '00000000-0002-4000-a000-000000000035',
  4,
  'Q4. In this topic, what does queue refer to?',
  'insert',
  'queue',
  'delete',
  'linked list',
  'B',
  'queue is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000005',
  '00000000-0002-4000-a000-000000000035',
  5,
  'Q5. What is hash table?',
  'value',
  'linked list',
  'complexity',
  'hash table',
  'D',
  'hash table is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000006',
  '00000000-0002-4000-a000-000000000035',
  6,
  'Q6. Which option is most directly associated with tree?',
  'heap',
  'tree',
  'LIFO',
  'delete',
  'B',
  'tree is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000007',
  '00000000-0002-4000-a000-000000000035',
  7,
  'Q7. Which statement best describes graph?',
  'tree',
  'hash table',
  'graph',
  'traversal',
  'C',
  'graph is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000008',
  '00000000-0002-4000-a000-000000000035',
  8,
  'Q8. In this topic, what does heap refer to?',
  'insert',
  'complexity',
  'hash table',
  'heap',
  'D',
  'heap is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000009',
  '00000000-0002-4000-a000-000000000035',
  9,
  'Q9. What is node?',
  'hash table',
  'complexity',
  'stack',
  'node',
  'D',
  'node is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000010',
  '00000000-0002-4000-a000-000000000035',
  10,
  'Q10. Which option is most directly associated with index?',
  'LIFO',
  'search',
  'heap',
  'index',
  'D',
  'index is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000011',
  '00000000-0002-4000-a000-000000000035',
  11,
  'Q11. Which statement best describes LIFO?',
  'graph',
  'LIFO',
  'value',
  'hash table',
  'B',
  'LIFO is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000012',
  '00000000-0002-4000-a000-000000000035',
  12,
  'Q12. In this topic, what does FIFO refer to?',
  'queue',
  'traversal',
  'FIFO',
  'linked list',
  'C',
  'FIFO is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000013',
  '00000000-0002-4000-a000-000000000035',
  13,
  'Q13. What is key?',
  'traversal',
  'value',
  'search',
  'key',
  'D',
  'key is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000014',
  '00000000-0002-4000-a000-000000000035',
  14,
  'Q14. Which option is most directly associated with value?',
  'delete',
  'index',
  'value',
  'data structure',
  'C',
  'value is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000015',
  '00000000-0002-4000-a000-000000000035',
  15,
  'Q15. Which statement best describes search?',
  'search',
  'index',
  'queue',
  'FIFO',
  'A',
  'search is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000016',
  '00000000-0002-4000-a000-000000000035',
  16,
  'Q16. What is array?',
  'search',
  'queue',
  'heap',
  'array',
  'D',
  'array is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000017',
  '00000000-0002-4000-a000-000000000035',
  17,
  'Q17. Which option is most directly associated with linked list?',
  'insert',
  'queue',
  'traversal',
  'linked list',
  'D',
  'linked list is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000018',
  '00000000-0002-4000-a000-000000000035',
  18,
  'Q18. Which statement best describes stack?',
  'node',
  'linked list',
  'queue',
  'stack',
  'D',
  'stack is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000019',
  '00000000-0002-4000-a000-000000000035',
  19,
  'Q19. In this topic, what does queue refer to?',
  'LIFO',
  'value',
  'queue',
  'insert',
  'C',
  'queue is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000035000020',
  '00000000-0002-4000-a000-000000000035',
  20,
  'Q20. What is hash table?',
  'hash table',
  'LIFO',
  'linked list',
  'queue',
  'A',
  'hash table is a key concept in Data Structures.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 36: Algorithms Basics Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000036',
  'Algorithms Basics Challenge Quiz',
  'Test your knowledge on Algorithms Basics with 20 comprehensive questions.',
  'Security',
  'CSE',
  'Advanced',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000001',
  '00000000-0002-4000-a000-000000000036',
  1,
  'Q1. What is algorithm?',
  'time complexity',
  'iteration',
  'search',
  'algorithm',
  'D',
  'algorithm is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000002',
  '00000000-0002-4000-a000-000000000036',
  2,
  'Q2. Which option is most directly associated with input?',
  'space complexity',
  'recursion',
  'input',
  'optimization',
  'C',
  'input is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000003',
  '00000000-0002-4000-a000-000000000036',
  3,
  'Q3. Which statement best describes output?',
  'output',
  'termination',
  'recursion',
  'greedy',
  'A',
  'output is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000004',
  '00000000-0002-4000-a000-000000000036',
  4,
  'Q4. In this topic, what does step refer to?',
  'optimization',
  'divide and conquer',
  'pseudocode',
  'step',
  'D',
  'step is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000005',
  '00000000-0002-4000-a000-000000000036',
  5,
  'Q5. What is correctness?',
  'output',
  'correctness',
  'time complexity',
  'algorithm',
  'B',
  'correctness is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000006',
  '00000000-0002-4000-a000-000000000036',
  6,
  'Q6. Which option is most directly associated with efficiency?',
  'divide and conquer',
  'iteration',
  'efficiency',
  'pseudocode',
  'C',
  'efficiency is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000007',
  '00000000-0002-4000-a000-000000000036',
  7,
  'Q7. Which statement best describes time complexity?',
  'iteration',
  'efficiency',
  'time complexity',
  'recursion',
  'C',
  'time complexity is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000008',
  '00000000-0002-4000-a000-000000000036',
  8,
  'Q8. In this topic, what does space complexity refer to?',
  'correctness',
  'recursion',
  'Big O',
  'space complexity',
  'D',
  'space complexity is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000009',
  '00000000-0002-4000-a000-000000000036',
  9,
  'Q9. What is Big O?',
  'divide and conquer',
  'termination',
  'Big O',
  'sort',
  'C',
  'Big O is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000010',
  '00000000-0002-4000-a000-000000000036',
  10,
  'Q10. Which option is most directly associated with search?',
  'input',
  'algorithm',
  'termination',
  'search',
  'D',
  'search is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000011',
  '00000000-0002-4000-a000-000000000036',
  11,
  'Q11. Which statement best describes sort?',
  'divide and conquer',
  'sort',
  'algorithm',
  'algorithm',
  'B',
  'sort is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000012',
  '00000000-0002-4000-a000-000000000036',
  12,
  'Q12. In this topic, what does recursion refer to?',
  'search',
  'efficiency',
  'recursion',
  'pseudocode',
  'C',
  'recursion is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000013',
  '00000000-0002-4000-a000-000000000036',
  13,
  'Q13. What is iteration?',
  'iteration',
  'search',
  'time complexity',
  'optimization',
  'A',
  'iteration is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000014',
  '00000000-0002-4000-a000-000000000036',
  14,
  'Q14. Which option is most directly associated with greedy?',
  'greedy',
  'algorithm',
  'optimization',
  'space complexity',
  'A',
  'greedy is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000015',
  '00000000-0002-4000-a000-000000000036',
  15,
  'Q15. Which statement best describes divide and conquer?',
  'recursion',
  'step',
  'Big O',
  'divide and conquer',
  'D',
  'divide and conquer is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000016',
  '00000000-0002-4000-a000-000000000036',
  16,
  'Q16. What is algorithm?',
  'termination',
  'sort',
  'space complexity',
  'algorithm',
  'D',
  'algorithm is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000017',
  '00000000-0002-4000-a000-000000000036',
  17,
  'Q17. Which option is most directly associated with input?',
  'input',
  'pseudocode',
  'Big O',
  'optimization',
  'A',
  'input is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000018',
  '00000000-0002-4000-a000-000000000036',
  18,
  'Q18. Which statement best describes output?',
  'output',
  'step',
  'termination',
  'greedy',
  'A',
  'output is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000019',
  '00000000-0002-4000-a000-000000000036',
  19,
  'Q19. In this topic, what does step refer to?',
  'algorithm',
  'sort',
  'step',
  'correctness',
  'C',
  'step is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000036000020',
  '00000000-0002-4000-a000-000000000036',
  20,
  'Q20. What is correctness?',
  'optimization',
  'divide and conquer',
  'input',
  'correctness',
  'D',
  'correctness is a key concept in Algorithms Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 37: Artificial Intelligence Basics Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000037',
  'Artificial Intelligence Basics Challenge Quiz',
  'Test your knowledge on Artificial Intelligence Basics with 20 comprehensive questions.',
  'Security',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000001',
  '00000000-0002-4000-a000-000000000037',
  1,
  'Q1. What is AI?',
  'computer vision',
  'AI',
  'bias',
  'agent',
  'B',
  'AI is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000002',
  '00000000-0002-4000-a000-000000000037',
  2,
  'Q2. Which option is most directly associated with model?',
  'model',
  'pattern',
  'bias',
  'AI',
  'A',
  'model is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000003',
  '00000000-0002-4000-a000-000000000037',
  3,
  'Q3. Which statement best describes data?',
  'pattern',
  'data',
  'computer vision',
  'evaluation',
  'B',
  'data is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000004',
  '00000000-0002-4000-a000-000000000037',
  4,
  'Q4. In this topic, what does prediction refer to?',
  'prediction',
  'neural network',
  'training',
  'speech',
  'A',
  'prediction is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000005',
  '00000000-0002-4000-a000-000000000037',
  5,
  'Q5. What is classification?',
  'training',
  'classification',
  'pattern',
  'natural language',
  'B',
  'classification is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000006',
  '00000000-0002-4000-a000-000000000037',
  6,
  'Q6. Which option is most directly associated with natural language?',
  'speech',
  'agent',
  'natural language',
  'prediction',
  'C',
  'natural language is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000007',
  '00000000-0002-4000-a000-000000000037',
  7,
  'Q7. Which statement best describes computer vision?',
  'neural network',
  'computer vision',
  'machine learning',
  'classification',
  'B',
  'computer vision is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000008',
  '00000000-0002-4000-a000-000000000037',
  8,
  'Q8. In this topic, what does pattern refer to?',
  'reasoning',
  'agent',
  'machine learning',
  'pattern',
  'D',
  'pattern is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000009',
  '00000000-0002-4000-a000-000000000037',
  9,
  'Q9. What is training?',
  'prediction',
  'bias',
  'AI',
  'training',
  'D',
  'training is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000010',
  '00000000-0002-4000-a000-000000000037',
  10,
  'Q10. Which option is most directly associated with inference?',
  'inference',
  'prediction',
  'neural network',
  'agent',
  'A',
  'inference is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000011',
  '00000000-0002-4000-a000-000000000037',
  11,
  'Q11. Which statement best describes automation?',
  'pattern',
  'automation',
  'model',
  'natural language',
  'B',
  'automation is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000012',
  '00000000-0002-4000-a000-000000000037',
  12,
  'Q12. In this topic, what does neural network refer to?',
  'neural network',
  'training',
  'model',
  'machine learning',
  'A',
  'neural network is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000013',
  '00000000-0002-4000-a000-000000000037',
  13,
  'Q13. What is machine learning?',
  'machine learning',
  'reasoning',
  'AI',
  'agent',
  'A',
  'machine learning is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000014',
  '00000000-0002-4000-a000-000000000037',
  14,
  'Q14. Which option is most directly associated with agent?',
  'agent',
  'inference',
  'bias',
  'prediction',
  'A',
  'agent is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000015',
  '00000000-0002-4000-a000-000000000037',
  15,
  'Q15. Which statement best describes recommendation?',
  'recommendation',
  'automation',
  'AI system',
  'neural network',
  'A',
  'recommendation is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000016',
  '00000000-0002-4000-a000-000000000037',
  16,
  'Q16. What is AI?',
  'neural network',
  'AI',
  'machine learning',
  'pattern',
  'B',
  'AI is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000017',
  '00000000-0002-4000-a000-000000000037',
  17,
  'Q17. Which option is most directly associated with model?',
  'evaluation',
  'pattern',
  'model',
  'data',
  'C',
  'model is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000018',
  '00000000-0002-4000-a000-000000000037',
  18,
  'Q18. Which statement best describes data?',
  'reasoning',
  'pattern',
  'automation',
  'data',
  'D',
  'data is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000019',
  '00000000-0002-4000-a000-000000000037',
  19,
  'Q19. In this topic, what does prediction refer to?',
  'agent',
  'AI',
  'prediction',
  'machine learning',
  'C',
  'prediction is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000037000020',
  '00000000-0002-4000-a000-000000000037',
  20,
  'Q20. What is classification?',
  'AI',
  'neural network',
  'classification',
  'evaluation',
  'C',
  'classification is a key concept in Artificial Intelligence Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 38: Machine Learning Basics Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000038',
  'Machine Learning Basics Challenge Quiz',
  'Test your knowledge on Machine Learning Basics with 20 comprehensive questions.',
  'IoT',
  'ECE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000001',
  '00000000-0002-4000-a000-000000000038',
  1,
  'Q1. What is machine learning?',
  'supervised',
  'machine learning',
  'feature',
  'algorithm',
  'B',
  'machine learning is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000002',
  '00000000-0002-4000-a000-000000000038',
  2,
  'Q2. Which option is most directly associated with dataset?',
  'reinforcement',
  'machine learning',
  'dataset',
  'validation',
  'C',
  'dataset is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000003',
  '00000000-0002-4000-a000-000000000038',
  3,
  'Q3. Which statement best describes feature?',
  'feature',
  'prediction',
  'underfitting',
  'clustering',
  'A',
  'feature is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000004',
  '00000000-0002-4000-a000-000000000038',
  4,
  'Q4. In this topic, what does label refer to?',
  'validation',
  'dataset',
  'inference',
  'label',
  'D',
  'label is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000005',
  '00000000-0002-4000-a000-000000000038',
  5,
  'Q5. What is training?',
  'algorithm',
  'training',
  'label',
  'accuracy',
  'B',
  'training is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000006',
  '00000000-0002-4000-a000-000000000038',
  6,
  'Q6. Which option is most directly associated with validation?',
  'inference',
  'validation',
  'classification',
  'machine learning',
  'B',
  'validation is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000007',
  '00000000-0002-4000-a000-000000000038',
  7,
  'Q7. Which statement best describes test?',
  'classification',
  'overfitting',
  'inference',
  'test',
  'D',
  'test is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000008',
  '00000000-0002-4000-a000-000000000038',
  8,
  'Q8. In this topic, what does supervised refer to?',
  'classification',
  'label',
  'supervised',
  'underfitting',
  'C',
  'supervised is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000009',
  '00000000-0002-4000-a000-000000000038',
  9,
  'Q9. What is unsupervised?',
  'algorithm',
  'unsupervised',
  'machine learning',
  'test',
  'B',
  'unsupervised is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000010',
  '00000000-0002-4000-a000-000000000038',
  10,
  'Q10. Which option is most directly associated with reinforcement?',
  'reinforcement',
  'unsupervised',
  'algorithm',
  'model',
  'A',
  'reinforcement is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000011',
  '00000000-0002-4000-a000-000000000038',
  11,
  'Q11. Which statement best describes classification?',
  'unsupervised',
  'machine learning',
  'supervised',
  'classification',
  'D',
  'classification is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000012',
  '00000000-0002-4000-a000-000000000038',
  12,
  'Q12. In this topic, what does regression refer to?',
  'supervised',
  'regression',
  'inference',
  'classification',
  'B',
  'regression is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000013',
  '00000000-0002-4000-a000-000000000038',
  13,
  'Q13. What is clustering?',
  'test',
  'training',
  'clustering',
  'machine learning',
  'C',
  'clustering is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000014',
  '00000000-0002-4000-a000-000000000038',
  14,
  'Q14. Which option is most directly associated with model?',
  'reinforcement',
  'supervised',
  'underfitting',
  'model',
  'D',
  'model is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000015',
  '00000000-0002-4000-a000-000000000038',
  15,
  'Q15. Which statement best describes overfitting?',
  'classification',
  'overfitting',
  'test',
  'inference',
  'B',
  'overfitting is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000016',
  '00000000-0002-4000-a000-000000000038',
  16,
  'Q16. What is machine learning?',
  'machine learning',
  'prediction',
  'model',
  'classification',
  'A',
  'machine learning is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000017',
  '00000000-0002-4000-a000-000000000038',
  17,
  'Q17. Which option is most directly associated with dataset?',
  'unsupervised',
  'training',
  'underfitting',
  'dataset',
  'D',
  'dataset is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000018',
  '00000000-0002-4000-a000-000000000038',
  18,
  'Q18. Which statement best describes feature?',
  'overfitting',
  'feature',
  'accuracy',
  'unsupervised',
  'B',
  'feature is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000019',
  '00000000-0002-4000-a000-000000000038',
  19,
  'Q19. In this topic, what does label refer to?',
  'label',
  'machine learning',
  'underfitting',
  'supervised',
  'A',
  'label is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000038000020',
  '00000000-0002-4000-a000-000000000038',
  20,
  'Q20. What is training?',
  'test',
  'unsupervised',
  'training',
  'model',
  'C',
  'training is a key concept in Machine Learning Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 39: Generative AI Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000039',
  'Generative AI Challenge Quiz',
  'Test your knowledge on Generative AI with 20 comprehensive questions.',
  'Electronics',
  'ECE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000001',
  '00000000-0002-4000-a000-000000000039',
  1,
  'Q1. What is generative AI?',
  'fine-tuning',
  'evaluation',
  'context',
  'generative AI',
  'D',
  'generative AI is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000002',
  '00000000-0002-4000-a000-000000000039',
  2,
  'Q2. Which option is most directly associated with model?',
  'hallucination',
  'inference',
  'generative AI',
  'model',
  'D',
  'model is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000003',
  '00000000-0002-4000-a000-000000000039',
  3,
  'Q3. Which statement best describes prompt?',
  'image',
  'code',
  'token',
  'prompt',
  'D',
  'prompt is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000004',
  '00000000-0002-4000-a000-000000000039',
  4,
  'Q4. In this topic, what does text refer to?',
  'text',
  'context',
  'generative AI',
  'generation',
  'A',
  'text is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000005',
  '00000000-0002-4000-a000-000000000039',
  5,
  'Q5. What is image?',
  'training data',
  'inference',
  'model',
  'image',
  'D',
  'image is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000006',
  '00000000-0002-4000-a000-000000000039',
  6,
  'Q6. Which option is most directly associated with audio?',
  'text',
  'audio',
  'prompt',
  'code',
  'B',
  'audio is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000007',
  '00000000-0002-4000-a000-000000000039',
  7,
  'Q7. Which statement best describes code?',
  'safety',
  'code',
  'output',
  'generation',
  'B',
  'code is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000008',
  '00000000-0002-4000-a000-000000000039',
  8,
  'Q8. In this topic, what does training data refer to?',
  'generative AI',
  'output',
  'training data',
  'generation',
  'C',
  'training data is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000009',
  '00000000-0002-4000-a000-000000000039',
  9,
  'Q9. What is inference?',
  'inference',
  'token',
  'generative AI',
  'text',
  'A',
  'inference is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000010',
  '00000000-0002-4000-a000-000000000039',
  10,
  'Q10. Which option is most directly associated with token?',
  'evaluation',
  'transformer',
  'text',
  'token',
  'D',
  'token is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000011',
  '00000000-0002-4000-a000-000000000039',
  11,
  'Q11. Which statement best describes hallucination?',
  'training data',
  'generative AI',
  'multimodal',
  'hallucination',
  'D',
  'hallucination is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000012',
  '00000000-0002-4000-a000-000000000039',
  12,
  'Q12. In this topic, what does context refer to?',
  'context',
  'code',
  'fine-tuning',
  'training data',
  'A',
  'context is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000013',
  '00000000-0002-4000-a000-000000000039',
  13,
  'Q13. What is transformer?',
  'output',
  'hallucination',
  'training data',
  'transformer',
  'D',
  'transformer is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000014',
  '00000000-0002-4000-a000-000000000039',
  14,
  'Q14. Which option is most directly associated with output?',
  'multimodal',
  'output',
  'prompt',
  'context',
  'B',
  'output is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000015',
  '00000000-0002-4000-a000-000000000039',
  15,
  'Q15. Which statement best describes evaluation?',
  'text',
  'bias',
  'evaluation',
  'token',
  'C',
  'evaluation is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000016',
  '00000000-0002-4000-a000-000000000039',
  16,
  'Q16. What is generative AI?',
  'safety',
  'multimodal',
  'inference',
  'generative AI',
  'D',
  'generative AI is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000017',
  '00000000-0002-4000-a000-000000000039',
  17,
  'Q17. Which option is most directly associated with model?',
  'model',
  'code',
  'prompt',
  'inference',
  'A',
  'model is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000018',
  '00000000-0002-4000-a000-000000000039',
  18,
  'Q18. Which statement best describes prompt?',
  'audio',
  'model',
  'token',
  'prompt',
  'D',
  'prompt is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000019',
  '00000000-0002-4000-a000-000000000039',
  19,
  'Q19. In this topic, what does text refer to?',
  'text',
  'audio',
  'output',
  'bias',
  'A',
  'text is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000039000020',
  '00000000-0002-4000-a000-000000000039',
  20,
  'Q20. What is image?',
  'training data',
  'token',
  'image',
  'hallucination',
  'C',
  'image is a key concept in Generative AI.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 40: Prompt Engineering Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000040',
  'Prompt Engineering Challenge Quiz',
  'Test your knowledge on Prompt Engineering with 20 comprehensive questions.',
  'Electronics',
  'ECE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000001',
  '00000000-0002-4000-a000-000000000040',
  1,
  'Q1. What is prompt?',
  'evaluation',
  'constraint',
  'prompt',
  'model',
  'C',
  'prompt is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000002',
  '00000000-0002-4000-a000-000000000040',
  2,
  'Q2. Which option is most directly associated with instruction?',
  'output',
  'system instruction',
  'zero-shot',
  'instruction',
  'D',
  'instruction is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000003',
  '00000000-0002-4000-a000-000000000040',
  3,
  'Q3. Which statement best describes context?',
  'context',
  'grounding',
  'prompt',
  'model',
  'A',
  'context is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000004',
  '00000000-0002-4000-a000-000000000040',
  4,
  'Q4. In this topic, what does constraint refer to?',
  'constraint',
  'iteration',
  'few-shot',
  'instruction',
  'A',
  'constraint is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000005',
  '00000000-0002-4000-a000-000000000040',
  5,
  'Q5. What is role?',
  'prompt',
  'clarity',
  'role',
  'zero-shot',
  'C',
  'role is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000006',
  '00000000-0002-4000-a000-000000000040',
  6,
  'Q6. Which option is most directly associated with format?',
  'constraint',
  'format',
  'temperature',
  'model',
  'B',
  'format is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000007',
  '00000000-0002-4000-a000-000000000040',
  7,
  'Q7. Which statement best describes example?',
  'example',
  'output',
  'prompt engineering',
  'context',
  'A',
  'example is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000008',
  '00000000-0002-4000-a000-000000000040',
  8,
  'Q8. In this topic, what does few-shot refer to?',
  'format',
  'few-shot',
  'clarity',
  'delimiter',
  'B',
  'few-shot is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000009',
  '00000000-0002-4000-a000-000000000040',
  9,
  'Q9. What is zero-shot?',
  'prompt',
  'constraint',
  'zero-shot',
  'clarity',
  'C',
  'zero-shot is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000010',
  '00000000-0002-4000-a000-000000000040',
  10,
  'Q10. Which option is most directly associated with output?',
  'example',
  'instruction',
  'temperature',
  'output',
  'D',
  'output is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000011',
  '00000000-0002-4000-a000-000000000040',
  11,
  'Q11. Which statement best describes evaluation?',
  'instruction',
  'format',
  'evaluation',
  'role',
  'C',
  'evaluation is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000012',
  '00000000-0002-4000-a000-000000000040',
  12,
  'Q12. In this topic, what does iteration refer to?',
  'zero-shot',
  'prompt',
  'delimiter',
  'iteration',
  'D',
  'iteration is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000013',
  '00000000-0002-4000-a000-000000000040',
  13,
  'Q13. What is clarity?',
  'specificity',
  'example',
  'clarity',
  'format',
  'C',
  'clarity is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000014',
  '00000000-0002-4000-a000-000000000040',
  14,
  'Q14. Which option is most directly associated with specificity?',
  'clarity',
  'constraint',
  'zero-shot',
  'specificity',
  'D',
  'specificity is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000015',
  '00000000-0002-4000-a000-000000000040',
  15,
  'Q15. Which statement best describes grounding?',
  'format',
  'clarity',
  'example',
  'grounding',
  'D',
  'grounding is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000016',
  '00000000-0002-4000-a000-000000000040',
  16,
  'Q16. What is prompt?',
  'format',
  'prompt',
  'iteration',
  'temperature',
  'B',
  'prompt is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000017',
  '00000000-0002-4000-a000-000000000040',
  17,
  'Q17. Which option is most directly associated with instruction?',
  'role',
  'context',
  'grounding',
  'instruction',
  'D',
  'instruction is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000018',
  '00000000-0002-4000-a000-000000000040',
  18,
  'Q18. Which statement best describes context?',
  'context',
  'example',
  'zero-shot',
  'role',
  'A',
  'context is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000019',
  '00000000-0002-4000-a000-000000000040',
  19,
  'Q19. In this topic, what does constraint refer to?',
  'context',
  'specificity',
  'constraint',
  'clarity',
  'C',
  'constraint is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000040000020',
  '00000000-0002-4000-a000-000000000040',
  20,
  'Q20. What is role?',
  'role',
  'prompt engineering',
  'clarity',
  'prompt',
  'A',
  'role is a key concept in Prompt Engineering.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 41: Internet of Things Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000041',
  'Internet of Things Challenge Quiz',
  'Test your knowledge on Internet of Things with 20 comprehensive questions.',
  'Telecom',
  'ECE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000001',
  '00000000-0002-4000-a000-000000000041',
  1,
  'Q1. What is IoT?',
  'network',
  'IoT',
  'actuator',
  'connectivity',
  'B',
  'IoT is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000002',
  '00000000-0002-4000-a000-000000000041',
  2,
  'Q2. Which option is most directly associated with sensor?',
  'firmware',
  'sensor',
  'gateway',
  'data',
  'B',
  'sensor is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000003',
  '00000000-0002-4000-a000-000000000041',
  3,
  'Q3. Which statement best describes device?',
  'application',
  'IoT',
  'monitoring',
  'device',
  'D',
  'device is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000004',
  '00000000-0002-4000-a000-000000000041',
  4,
  'Q4. In this topic, what does network refer to?',
  'device',
  'IoT',
  'edge',
  'network',
  'D',
  'network is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000005',
  '00000000-0002-4000-a000-000000000041',
  5,
  'Q5. What is gateway?',
  'embedded',
  'device',
  'monitoring',
  'gateway',
  'D',
  'gateway is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000006',
  '00000000-0002-4000-a000-000000000041',
  6,
  'Q6. Which option is most directly associated with cloud?',
  'cloud',
  'network',
  'edge',
  'monitoring',
  'A',
  'cloud is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000007',
  '00000000-0002-4000-a000-000000000041',
  7,
  'Q7. Which statement best describes edge?',
  'firmware',
  'monitoring',
  'MQTT',
  'edge',
  'D',
  'edge is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000008',
  '00000000-0002-4000-a000-000000000041',
  8,
  'Q8. In this topic, what does data refer to?',
  'actuator',
  'monitoring',
  'firmware',
  'data',
  'D',
  'data is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000009',
  '00000000-0002-4000-a000-000000000041',
  9,
  'Q9. What is actuator?',
  'actuator',
  'telemetry',
  'application',
  'gateway',
  'A',
  'actuator is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000010',
  '00000000-0002-4000-a000-000000000041',
  10,
  'Q10. Which option is most directly associated with telemetry?',
  'IoT',
  'telemetry',
  'automation',
  'firmware',
  'B',
  'telemetry is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000011',
  '00000000-0002-4000-a000-000000000041',
  11,
  'Q11. Which statement best describes protocol?',
  'connectivity',
  'sensor',
  'protocol',
  'automation',
  'C',
  'protocol is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000012',
  '00000000-0002-4000-a000-000000000041',
  12,
  'Q12. In this topic, what does MQTT refer to?',
  'IoT',
  'MQTT',
  'protocol',
  'network',
  'B',
  'MQTT is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000013',
  '00000000-0002-4000-a000-000000000041',
  13,
  'Q13. What is embedded?',
  'actuator',
  'embedded',
  'sensor',
  'IoT',
  'B',
  'embedded is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000014',
  '00000000-0002-4000-a000-000000000041',
  14,
  'Q14. Which option is most directly associated with automation?',
  'automation',
  'firmware',
  'embedded',
  'device',
  'A',
  'automation is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000015',
  '00000000-0002-4000-a000-000000000041',
  15,
  'Q15. Which statement best describes monitoring?',
  'gateway',
  'sensor',
  'connectivity',
  'monitoring',
  'D',
  'monitoring is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000016',
  '00000000-0002-4000-a000-000000000041',
  16,
  'Q16. What is IoT?',
  'automation',
  'IoT',
  'actuator',
  'edge',
  'B',
  'IoT is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000017',
  '00000000-0002-4000-a000-000000000041',
  17,
  'Q17. Which option is most directly associated with sensor?',
  'sensor',
  'security',
  'application',
  'cloud',
  'A',
  'sensor is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000018',
  '00000000-0002-4000-a000-000000000041',
  18,
  'Q18. Which statement best describes device?',
  'security',
  'edge',
  'protocol',
  'device',
  'D',
  'device is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000019',
  '00000000-0002-4000-a000-000000000041',
  19,
  'Q19. In this topic, what does network refer to?',
  'connectivity',
  'network',
  'device',
  'data',
  'B',
  'network is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000041000020',
  '00000000-0002-4000-a000-000000000041',
  20,
  'Q20. What is gateway?',
  'device',
  'data',
  'device management',
  'gateway',
  'D',
  'gateway is a key concept in Internet of Things.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 42: Blockchain Basics Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000042',
  'Blockchain Basics Challenge Quiz',
  'Test your knowledge on Blockchain Basics with 20 comprehensive questions.',
  'Electrical',
  'EEE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000001',
  '00000000-0002-4000-a000-000000000042',
  1,
  'Q1. What is blockchain?',
  'cryptography',
  'node',
  'blockchain',
  'transaction',
  'C',
  'blockchain is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000002',
  '00000000-0002-4000-a000-000000000042',
  2,
  'Q2. Which option is most directly associated with block?',
  'proof of work',
  'decentralization',
  'transaction',
  'block',
  'D',
  'block is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000003',
  '00000000-0002-4000-a000-000000000042',
  3,
  'Q3. Which statement best describes ledger?',
  'blockchain',
  'proof of work',
  'ledger',
  'hash',
  'C',
  'ledger is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000004',
  '00000000-0002-4000-a000-000000000042',
  4,
  'Q4. In this topic, what does transaction refer to?',
  'transaction',
  'block',
  'proof of stake',
  'immutability',
  'A',
  'transaction is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000005',
  '00000000-0002-4000-a000-000000000042',
  5,
  'Q5. What is hash?',
  'wallet',
  'hash',
  'consensus',
  'private key',
  'B',
  'hash is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000006',
  '00000000-0002-4000-a000-000000000042',
  6,
  'Q6. Which option is most directly associated with node?',
  'node',
  'private key',
  'cryptography',
  'consensus',
  'A',
  'node is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000007',
  '00000000-0002-4000-a000-000000000042',
  7,
  'Q7. Which statement best describes distributed?',
  'public key',
  'distributed',
  'transaction',
  'smart contract',
  'B',
  'distributed is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000008',
  '00000000-0002-4000-a000-000000000042',
  8,
  'Q8. In this topic, what does consensus refer to?',
  'block',
  'node',
  'consensus',
  'wallet',
  'C',
  'consensus is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000009',
  '00000000-0002-4000-a000-000000000042',
  9,
  'Q9. What is proof of work?',
  'verification',
  'ledger',
  'proof of work',
  'chain',
  'C',
  'proof of work is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000010',
  '00000000-0002-4000-a000-000000000042',
  10,
  'Q10. Which option is most directly associated with proof of stake?',
  'ledger',
  'public key',
  'proof of stake',
  'private key',
  'C',
  'proof of stake is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000011',
  '00000000-0002-4000-a000-000000000042',
  11,
  'Q11. Which statement best describes wallet?',
  'wallet',
  'verification',
  'chain',
  'smart contract',
  'A',
  'wallet is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000012',
  '00000000-0002-4000-a000-000000000042',
  12,
  'Q12. In this topic, what does public key refer to?',
  'public key',
  'node',
  'decentralization',
  'block',
  'A',
  'public key is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000013',
  '00000000-0002-4000-a000-000000000042',
  13,
  'Q13. What is private key?',
  'private key',
  'decentralization',
  'public key',
  'chain',
  'A',
  'private key is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000014',
  '00000000-0002-4000-a000-000000000042',
  14,
  'Q14. Which option is most directly associated with smart contract?',
  'blockchain',
  'proof of work',
  'smart contract',
  'wallet',
  'C',
  'smart contract is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000015',
  '00000000-0002-4000-a000-000000000042',
  15,
  'Q15. Which statement best describes chain?',
  'decentralization',
  'consensus',
  'chain',
  'distributed',
  'C',
  'chain is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000016',
  '00000000-0002-4000-a000-000000000042',
  16,
  'Q16. What is blockchain?',
  'chain',
  'proof of stake',
  'transaction',
  'blockchain',
  'D',
  'blockchain is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000017',
  '00000000-0002-4000-a000-000000000042',
  17,
  'Q17. Which option is most directly associated with block?',
  'decentralization',
  'transaction',
  'token',
  'block',
  'D',
  'block is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000018',
  '00000000-0002-4000-a000-000000000042',
  18,
  'Q18. Which statement best describes ledger?',
  'wallet',
  'token',
  'blockchain',
  'ledger',
  'D',
  'ledger is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000019',
  '00000000-0002-4000-a000-000000000042',
  19,
  'Q19. In this topic, what does transaction refer to?',
  'verification',
  'transaction',
  'ledger',
  'public key',
  'B',
  'transaction is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000042000020',
  '00000000-0002-4000-a000-000000000042',
  20,
  'Q20. What is hash?',
  'cryptography',
  'block',
  'hash',
  'token',
  'C',
  'hash is a key concept in Blockchain Basics.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 43: Digital Electronics Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000043',
  'Digital Electronics Challenge Quiz',
  'Test your knowledge on Digital Electronics with 20 comprehensive questions.',
  'Mechanical',
  'MECH',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000001',
  '00000000-0002-4000-a000-000000000043',
  1,
  'Q1. What is digital?',
  'flip-flop',
  'OR',
  'register',
  'digital',
  'D',
  'digital is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000002',
  '00000000-0002-4000-a000-000000000043',
  2,
  'Q2. Which option is most directly associated with binary?',
  'binary',
  'circuit',
  'AND',
  'counter',
  'A',
  'binary is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000003',
  '00000000-0002-4000-a000-000000000043',
  3,
  'Q3. Which statement best describes logic gate?',
  'bit',
  'logic gate',
  'counter',
  'truth table',
  'B',
  'logic gate is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000004',
  '00000000-0002-4000-a000-000000000043',
  4,
  'Q4. In this topic, what does AND refer to?',
  'binary',
  'NAND',
  'AND',
  'counter',
  'C',
  'AND is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000005',
  '00000000-0002-4000-a000-000000000043',
  5,
  'Q5. What is OR?',
  'signal',
  'combinational',
  'bit',
  'OR',
  'D',
  'OR is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000006',
  '00000000-0002-4000-a000-000000000043',
  6,
  'Q6. Which option is most directly associated with NOT?',
  'NOT',
  'signal',
  'AND',
  'logic level',
  'A',
  'NOT is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000007',
  '00000000-0002-4000-a000-000000000043',
  7,
  'Q7. Which statement best describes NAND?',
  'logic gate',
  'truth table',
  'AND',
  'NAND',
  'D',
  'NAND is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000008',
  '00000000-0002-4000-a000-000000000043',
  8,
  'Q8. In this topic, what does NOR refer to?',
  'NOR',
  'bit',
  'AND',
  'register',
  'A',
  'NOR is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000009',
  '00000000-0002-4000-a000-000000000043',
  9,
  'Q9. What is XOR?',
  'Boolean',
  'XOR',
  'AND',
  'OR',
  'B',
  'XOR is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000010',
  '00000000-0002-4000-a000-000000000043',
  10,
  'Q10. Which option is most directly associated with bit?',
  'circuit',
  'bit',
  'logic gate',
  'flip-flop',
  'B',
  'bit is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000011',
  '00000000-0002-4000-a000-000000000043',
  11,
  'Q11. Which statement best describes Boolean?',
  'circuit',
  'Boolean',
  'binary',
  'logic level',
  'B',
  'Boolean is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000012',
  '00000000-0002-4000-a000-000000000043',
  12,
  'Q12. In this topic, what does truth table refer to?',
  'truth table',
  'circuit',
  'NOR',
  'OR',
  'A',
  'truth table is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000013',
  '00000000-0002-4000-a000-000000000043',
  13,
  'Q13. What is flip-flop?',
  'NOR',
  'flip-flop',
  'truth table',
  'logic gate',
  'B',
  'flip-flop is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000014',
  '00000000-0002-4000-a000-000000000043',
  14,
  'Q14. Which option is most directly associated with register?',
  'OR',
  'NOT',
  'digital',
  'register',
  'D',
  'register is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000015',
  '00000000-0002-4000-a000-000000000043',
  15,
  'Q15. Which statement best describes counter?',
  'NOR',
  'Boolean',
  'NOT',
  'counter',
  'D',
  'counter is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000016',
  '00000000-0002-4000-a000-000000000043',
  16,
  'Q16. What is digital?',
  'logic gate',
  'NOT',
  'XOR',
  'digital',
  'D',
  'digital is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000017',
  '00000000-0002-4000-a000-000000000043',
  17,
  'Q17. Which option is most directly associated with binary?',
  'OR',
  'Boolean',
  'binary',
  'NAND',
  'C',
  'binary is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000018',
  '00000000-0002-4000-a000-000000000043',
  18,
  'Q18. Which statement best describes logic gate?',
  'logic gate',
  'OR',
  'truth table',
  'flip-flop',
  'A',
  'logic gate is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000019',
  '00000000-0002-4000-a000-000000000043',
  19,
  'Q19. In this topic, what does AND refer to?',
  'signal',
  'AND',
  'Boolean',
  'combinational',
  'B',
  'AND is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000043000020',
  '00000000-0002-4000-a000-000000000043',
  20,
  'Q20. What is OR?',
  'OR',
  'combinational',
  'binary',
  'counter',
  'A',
  'OR is a key concept in Digital Electronics.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 44: Microcontrollers Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000044',
  'Microcontrollers Challenge Quiz',
  'Test your knowledge on Microcontrollers with 20 comprehensive questions.',
  'Mechanical',
  'MECH',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000001',
  '00000000-0002-4000-a000-000000000044',
  1,
  'Q1. What is microcontroller?',
  'program',
  'I2C',
  'peripheral',
  'microcontroller',
  'D',
  'microcontroller is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000002',
  '00000000-0002-4000-a000-000000000044',
  2,
  'Q2. Which option is most directly associated with CPU?',
  'I2C',
  'CPU',
  'timer',
  'clock',
  'B',
  'CPU is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000003',
  '00000000-0002-4000-a000-000000000044',
  3,
  'Q3. Which statement best describes memory?',
  'CPU',
  'I2C',
  'interrupt',
  'memory',
  'D',
  'memory is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000004',
  '00000000-0002-4000-a000-000000000044',
  4,
  'Q4. In this topic, what does GPIO refer to?',
  'GPIO',
  'RAM',
  'program',
  'controller',
  'A',
  'GPIO is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000005',
  '00000000-0002-4000-a000-000000000044',
  5,
  'Q5. What is timer?',
  'embedded',
  'SPI',
  'timer',
  'UART',
  'C',
  'timer is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000006',
  '00000000-0002-4000-a000-000000000044',
  6,
  'Q6. Which option is most directly associated with ADC?',
  'microcontroller',
  'firmware',
  'CPU',
  'ADC',
  'D',
  'ADC is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000007',
  '00000000-0002-4000-a000-000000000044',
  7,
  'Q7. Which statement best describes UART?',
  'I2C',
  'timer',
  'CPU',
  'UART',
  'D',
  'UART is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000008',
  '00000000-0002-4000-a000-000000000044',
  8,
  'Q8. In this topic, what does SPI refer to?',
  'program',
  'SPI',
  'embedded',
  'clock',
  'B',
  'SPI is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000009',
  '00000000-0002-4000-a000-000000000044',
  9,
  'Q9. What is I2C?',
  'firmware',
  'output',
  'input',
  'I2C',
  'D',
  'I2C is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000010',
  '00000000-0002-4000-a000-000000000044',
  10,
  'Q10. Which option is most directly associated with interrupt?',
  'interrupt',
  'ADC',
  'RAM',
  'UART',
  'A',
  'interrupt is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000011',
  '00000000-0002-4000-a000-000000000044',
  11,
  'Q11. Which statement best describes firmware?',
  'embedded',
  'I2C',
  'firmware',
  'GPIO',
  'C',
  'firmware is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000012',
  '00000000-0002-4000-a000-000000000044',
  12,
  'Q12. In this topic, what does embedded refer to?',
  'embedded',
  'firmware',
  'I2C',
  'ADC',
  'A',
  'embedded is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000013',
  '00000000-0002-4000-a000-000000000044',
  13,
  'Q13. What is input?',
  'UART',
  'memory',
  'ADC',
  'input',
  'D',
  'input is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000014',
  '00000000-0002-4000-a000-000000000044',
  14,
  'Q14. Which option is most directly associated with output?',
  'flash',
  'output',
  'RAM',
  'timer',
  'B',
  'output is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000015',
  '00000000-0002-4000-a000-000000000044',
  15,
  'Q15. Which statement best describes clock?',
  'clock',
  'SPI',
  'flash',
  'GPIO',
  'A',
  'clock is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000016',
  '00000000-0002-4000-a000-000000000044',
  16,
  'Q16. What is microcontroller?',
  'program',
  'interrupt',
  'microcontroller',
  'GPIO',
  'C',
  'microcontroller is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000017',
  '00000000-0002-4000-a000-000000000044',
  17,
  'Q17. Which option is most directly associated with CPU?',
  'I2C',
  'microcontroller',
  'CPU',
  'memory',
  'C',
  'CPU is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000018',
  '00000000-0002-4000-a000-000000000044',
  18,
  'Q18. Which statement best describes memory?',
  'flash',
  'memory',
  'peripheral',
  'microcontroller',
  'B',
  'memory is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000019',
  '00000000-0002-4000-a000-000000000044',
  19,
  'Q19. In this topic, what does GPIO refer to?',
  'CPU',
  'UART',
  'GPIO',
  'I2C',
  'C',
  'GPIO is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000044000020',
  '00000000-0002-4000-a000-000000000044',
  20,
  'Q20. What is timer?',
  'microcontroller',
  'controller',
  'timer',
  'I2C',
  'C',
  'timer is a key concept in Microcontrollers.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 45: Sensors & Embedded Systems Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000045',
  'Sensors & Embedded Systems Challenge Quiz',
  'Test your knowledge on Sensors & Embedded Systems with 20 comprehensive questions.',
  'Civil',
  'CIVIL',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000001',
  '00000000-0002-4000-a000-000000000045',
  1,
  'Q1. What is sensor?',
  'application',
  'sensor',
  'output',
  'sampling',
  'B',
  'sensor is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000002',
  '00000000-0002-4000-a000-000000000045',
  2,
  'Q2. Which option is most directly associated with embedded system?',
  'embedded system',
  'power',
  'control',
  'sampling',
  'A',
  'embedded system is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000003',
  '00000000-0002-4000-a000-000000000045',
  3,
  'Q3. Which statement best describes temperature?',
  'communication',
  'application',
  'sensor',
  'temperature',
  'D',
  'temperature is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000004',
  '00000000-0002-4000-a000-000000000045',
  4,
  'Q4. In this topic, what does light refer to?',
  'microcontroller',
  'device',
  'motion',
  'light',
  'D',
  'light is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000005',
  '00000000-0002-4000-a000-000000000045',
  5,
  'Q5. What is motion?',
  'calibration',
  'motion',
  'control',
  'device',
  'B',
  'motion is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000006',
  '00000000-0002-4000-a000-000000000045',
  6,
  'Q6. Which option is most directly associated with signal?',
  'sensor',
  'communication',
  'signal',
  'embedded system',
  'C',
  'signal is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000007',
  '00000000-0002-4000-a000-000000000045',
  7,
  'Q7. Which statement best describes ADC?',
  'firmware',
  'temperature',
  'ADC',
  'sampling',
  'C',
  'ADC is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000008',
  '00000000-0002-4000-a000-000000000045',
  8,
  'Q8. In this topic, what does actuator refer to?',
  'sensor',
  'signal',
  'temperature',
  'actuator',
  'D',
  'actuator is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000009',
  '00000000-0002-4000-a000-000000000045',
  9,
  'Q9. What is microcontroller?',
  'motion',
  'microcontroller',
  'output',
  'calibration',
  'B',
  'microcontroller is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000010',
  '00000000-0002-4000-a000-000000000045',
  10,
  'Q10. Which option is most directly associated with firmware?',
  'temperature',
  'device',
  'firmware',
  'motion',
  'C',
  'firmware is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000011',
  '00000000-0002-4000-a000-000000000045',
  11,
  'Q11. Which statement best describes real-time?',
  'application',
  'real-time',
  'communication',
  'device',
  'B',
  'real-time is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000012',
  '00000000-0002-4000-a000-000000000045',
  12,
  'Q12. In this topic, what does input refer to?',
  'input',
  'sensor',
  'signal',
  'output',
  'A',
  'input is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000013',
  '00000000-0002-4000-a000-000000000045',
  13,
  'Q13. What is output?',
  'output',
  'application',
  'power',
  'communication',
  'A',
  'output is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000014',
  '00000000-0002-4000-a000-000000000045',
  14,
  'Q14. Which option is most directly associated with calibration?',
  'microcontroller',
  'embedded system',
  'calibration',
  'device',
  'C',
  'calibration is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000015',
  '00000000-0002-4000-a000-000000000045',
  15,
  'Q15. Which statement best describes sampling?',
  'temperature',
  'real-time',
  'application',
  'sampling',
  'D',
  'sampling is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000016',
  '00000000-0002-4000-a000-000000000045',
  16,
  'Q16. What is sensor?',
  'motion',
  'sampling',
  'firmware',
  'sensor',
  'D',
  'sensor is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000017',
  '00000000-0002-4000-a000-000000000045',
  17,
  'Q17. Which option is most directly associated with embedded system?',
  'communication',
  'device',
  'power',
  'embedded system',
  'D',
  'embedded system is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000018',
  '00000000-0002-4000-a000-000000000045',
  18,
  'Q18. Which statement best describes temperature?',
  'device',
  'embedded system',
  'temperature',
  'motion',
  'C',
  'temperature is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000019',
  '00000000-0002-4000-a000-000000000045',
  19,
  'Q19. In this topic, what does light refer to?',
  'signal',
  'calibration',
  'light',
  'actuator',
  'C',
  'light is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000045000020',
  '00000000-0002-4000-a000-000000000045',
  20,
  'Q20. What is motion?',
  'control',
  'motion',
  'ADC',
  'device',
  'B',
  'motion is a key concept in Sensors & Embedded Systems.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 46: Cloud Storage Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000046',
  'Cloud Storage Challenge Quiz',
  'Test your knowledge on Cloud Storage with 20 comprehensive questions.',
  'Design',
  'MECH',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000001',
  '00000000-0002-4000-a000-000000000046',
  1,
  'Q1. What is cloud storage?',
  'region',
  'cloud storage',
  'data transfer',
  'bucket',
  'B',
  'cloud storage is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000002',
  '00000000-0002-4000-a000-000000000046',
  2,
  'Q2. Which option is most directly associated with object?',
  'access control',
  'object',
  'storage class',
  'availability',
  'B',
  'object is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000003',
  '00000000-0002-4000-a000-000000000046',
  3,
  'Q3. Which statement best describes file?',
  'access control',
  'file',
  'download',
  'scalability',
  'B',
  'file is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000004',
  '00000000-0002-4000-a000-000000000046',
  4,
  'Q4. In this topic, what does bucket refer to?',
  'sync',
  'metadata',
  'bucket',
  'file',
  'C',
  'bucket is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000005',
  '00000000-0002-4000-a000-000000000046',
  5,
  'Q5. What is upload?',
  'sharing',
  'upload',
  'backup',
  'storage class',
  'B',
  'upload is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000006',
  '00000000-0002-4000-a000-000000000046',
  6,
  'Q6. Which option is most directly associated with download?',
  'metadata',
  'download',
  'versioning',
  'bucket',
  'B',
  'download is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000007',
  '00000000-0002-4000-a000-000000000046',
  7,
  'Q7. Which statement best describes sync?',
  'sharing',
  'sync',
  'backup',
  'object',
  'B',
  'sync is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000008',
  '00000000-0002-4000-a000-000000000046',
  8,
  'Q8. In this topic, what does backup refer to?',
  'bucket',
  'download',
  'backup',
  'sharing',
  'C',
  'backup is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000009',
  '00000000-0002-4000-a000-000000000046',
  9,
  'Q9. What is sharing?',
  'file',
  'bucket',
  'redundancy',
  'sharing',
  'D',
  'sharing is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000010',
  '00000000-0002-4000-a000-000000000046',
  10,
  'Q10. Which option is most directly associated with access control?',
  'storage class',
  'access control',
  'bucket',
  'cloud storage',
  'B',
  'access control is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000011',
  '00000000-0002-4000-a000-000000000046',
  11,
  'Q11. Which statement best describes encryption?',
  'encryption',
  'backup',
  'versioning',
  'access control',
  'A',
  'encryption is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000012',
  '00000000-0002-4000-a000-000000000046',
  12,
  'Q12. In this topic, what does redundancy refer to?',
  'encryption',
  'upload',
  'cloud storage',
  'redundancy',
  'D',
  'redundancy is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000013',
  '00000000-0002-4000-a000-000000000046',
  13,
  'Q13. What is availability?',
  'lifecycle',
  'availability',
  'file',
  'versioning',
  'B',
  'availability is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000014',
  '00000000-0002-4000-a000-000000000046',
  14,
  'Q14. Which option is most directly associated with scalability?',
  'availability',
  'scalability',
  'cloud storage',
  'lifecycle',
  'B',
  'scalability is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000015',
  '00000000-0002-4000-a000-000000000046',
  15,
  'Q15. Which statement best describes storage class?',
  'bucket',
  'scalability',
  'versioning',
  'storage class',
  'D',
  'storage class is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000016',
  '00000000-0002-4000-a000-000000000046',
  16,
  'Q16. What is cloud storage?',
  'cloud storage',
  'backup',
  'scalability',
  'encryption',
  'A',
  'cloud storage is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000017',
  '00000000-0002-4000-a000-000000000046',
  17,
  'Q17. Which option is most directly associated with object?',
  'metadata',
  'object',
  'redundancy',
  'region',
  'B',
  'object is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000018',
  '00000000-0002-4000-a000-000000000046',
  18,
  'Q18. Which statement best describes file?',
  'cloud storage',
  'data transfer',
  'file',
  'storage class',
  'C',
  'file is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000019',
  '00000000-0002-4000-a000-000000000046',
  19,
  'Q19. In this topic, what does bucket refer to?',
  'object',
  'upload',
  'availability',
  'bucket',
  'D',
  'bucket is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000046000020',
  '00000000-0002-4000-a000-000000000046',
  20,
  'Q20. What is upload?',
  'lifecycle',
  'upload',
  'availability',
  'data transfer',
  'B',
  'upload is a key concept in Cloud Storage.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 47: SQL vs NoSQL Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000047',
  'SQL vs NoSQL Challenge Quiz',
  'Test your knowledge on SQL vs NoSQL with 20 comprehensive questions.',
  'Management',
  'CSE',
  'Beginner',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000001',
  '00000000-0002-4000-a000-000000000047',
  1,
  'Q1. What is SQL?',
  'table',
  'SQL',
  'graph',
  'data model',
  'B',
  'SQL is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000002',
  '00000000-0002-4000-a000-000000000047',
  2,
  'Q2. Which option is most directly associated with relational?',
  'key-value',
  'graph',
  'NoSQL',
  'relational',
  'D',
  'relational is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000003',
  '00000000-0002-4000-a000-000000000047',
  3,
  'Q3. Which statement best describes table?',
  'table',
  'index',
  'consistency',
  'transaction',
  'A',
  'table is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000004',
  '00000000-0002-4000-a000-000000000047',
  4,
  'Q4. In this topic, what does row refer to?',
  'schema',
  'row',
  'document',
  'table',
  'B',
  'row is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000005',
  '00000000-0002-4000-a000-000000000047',
  5,
  'Q5. What is column?',
  'database',
  'column',
  'graph',
  'wide-column',
  'B',
  'column is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000006',
  '00000000-0002-4000-a000-000000000047',
  6,
  'Q6. Which option is most directly associated with schema?',
  'index',
  'schema',
  'data model',
  'JOIN',
  'B',
  'schema is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000007',
  '00000000-0002-4000-a000-000000000047',
  7,
  'Q7. Which statement best describes NoSQL?',
  'row',
  'NoSQL',
  'SQL',
  'wide-column',
  'B',
  'NoSQL is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000008',
  '00000000-0002-4000-a000-000000000047',
  8,
  'Q8. In this topic, what does document refer to?',
  'consistency',
  'data model',
  'document',
  'NoSQL',
  'C',
  'document is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000009',
  '00000000-0002-4000-a000-000000000047',
  9,
  'Q9. What is key-value?',
  'JOIN',
  'key-value',
  'index',
  'graph',
  'B',
  'key-value is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000010',
  '00000000-0002-4000-a000-000000000047',
  10,
  'Q10. Which option is most directly associated with wide-column?',
  'relational',
  'JOIN',
  'wide-column',
  'scalability',
  'C',
  'wide-column is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000011',
  '00000000-0002-4000-a000-000000000047',
  11,
  'Q11. Which statement best describes graph?',
  'graph',
  'row',
  'document',
  'query',
  'A',
  'graph is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000012',
  '00000000-0002-4000-a000-000000000047',
  12,
  'Q12. In this topic, what does JOIN refer to?',
  'transaction',
  'schema',
  'database',
  'JOIN',
  'D',
  'JOIN is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000013',
  '00000000-0002-4000-a000-000000000047',
  13,
  'Q13. What is transaction?',
  'row',
  'query',
  'transaction',
  'scalability',
  'C',
  'transaction is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000014',
  '00000000-0002-4000-a000-000000000047',
  14,
  'Q14. Which option is most directly associated with scalability?',
  'transaction',
  'scalability',
  'schema',
  'row',
  'B',
  'scalability is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000015',
  '00000000-0002-4000-a000-000000000047',
  15,
  'Q15. Which statement best describes flexible schema?',
  'table',
  'SQL',
  'flexible schema',
  'relational',
  'C',
  'flexible schema is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000016',
  '00000000-0002-4000-a000-000000000047',
  16,
  'Q16. What is SQL?',
  'schema',
  'wide-column',
  'SQL',
  'JOIN',
  'C',
  'SQL is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000017',
  '00000000-0002-4000-a000-000000000047',
  17,
  'Q17. Which option is most directly associated with relational?',
  'JOIN',
  'database',
  'schema',
  'relational',
  'D',
  'relational is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000018',
  '00000000-0002-4000-a000-000000000047',
  18,
  'Q18. Which statement best describes table?',
  'table',
  'wide-column',
  'schema',
  'SQL',
  'A',
  'table is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000019',
  '00000000-0002-4000-a000-000000000047',
  19,
  'Q19. In this topic, what does row refer to?',
  'flexible schema',
  'relational',
  'row',
  'scalability',
  'C',
  'row is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000047000020',
  '00000000-0002-4000-a000-000000000047',
  20,
  'Q20. What is column?',
  'key-value',
  'column',
  'transaction',
  'wide-column',
  'B',
  'column is a key concept in SQL vs NoSQL.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 48: Mobile App Development Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000048',
  'Mobile App Development Challenge Quiz',
  'Test your knowledge on Mobile App Development with 20 comprehensive questions.',
  'Data Science',
  'CSE',
  'Intermediate',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000001',
  '00000000-0002-4000-a000-000000000048',
  1,
  'Q1. What is mobile app?',
  'build',
  'mobile app',
  'permissions',
  'iOS',
  'B',
  'mobile app is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000002',
  '00000000-0002-4000-a000-000000000048',
  2,
  'Q2. Which option is most directly associated with Android?',
  'API',
  'Android',
  'cross-platform',
  'navigation',
  'B',
  'Android is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000003',
  '00000000-0002-4000-a000-000000000048',
  3,
  'Q3. Which statement best describes iOS?',
  'cross-platform',
  'deployment',
  'API',
  'iOS',
  'D',
  'iOS is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000004',
  '00000000-0002-4000-a000-000000000048',
  4,
  'Q4. In this topic, what does native refer to?',
  'cross-platform',
  'native',
  'permissions',
  'Android',
  'B',
  'native is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000005',
  '00000000-0002-4000-a000-000000000048',
  5,
  'Q5. What is cross-platform?',
  'navigation',
  'cross-platform',
  'mobile app',
  'app lifecycle',
  'B',
  'cross-platform is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000006',
  '00000000-0002-4000-a000-000000000048',
  6,
  'Q6. Which option is most directly associated with UI?',
  'testing',
  'UI',
  'local storage',
  'responsive',
  'B',
  'UI is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000007',
  '00000000-0002-4000-a000-000000000048',
  7,
  'Q7. Which statement best describes navigation?',
  'notification',
  'deployment',
  'responsive',
  'navigation',
  'D',
  'navigation is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000008',
  '00000000-0002-4000-a000-000000000048',
  8,
  'Q8. In this topic, what does API refer to?',
  'API',
  'notification',
  'permissions',
  'deployment',
  'A',
  'API is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000009',
  '00000000-0002-4000-a000-000000000048',
  9,
  'Q9. What is local storage?',
  'local storage',
  'authentication',
  'store',
  'UI',
  'A',
  'local storage is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000010',
  '00000000-0002-4000-a000-000000000048',
  10,
  'Q10. Which option is most directly associated with authentication?',
  'authentication',
  'performance',
  'app lifecycle',
  'cross-platform',
  'A',
  'authentication is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000011',
  '00000000-0002-4000-a000-000000000048',
  11,
  'Q11. Which statement best describes notification?',
  'notification',
  'build',
  'permissions',
  'store',
  'A',
  'notification is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000012',
  '00000000-0002-4000-a000-000000000048',
  12,
  'Q12. In this topic, what does testing refer to?',
  'testing',
  'navigation',
  'framework',
  'Android',
  'A',
  'testing is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000013',
  '00000000-0002-4000-a000-000000000048',
  13,
  'Q13. What is deployment?',
  'cross-platform',
  'permissions',
  'deployment',
  'API',
  'C',
  'deployment is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000014',
  '00000000-0002-4000-a000-000000000048',
  14,
  'Q14. Which option is most directly associated with responsive?',
  'mobile app',
  'responsive',
  'native',
  'Android',
  'B',
  'responsive is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000015',
  '00000000-0002-4000-a000-000000000048',
  15,
  'Q15. Which statement best describes performance?',
  'notification',
  'mobile app',
  'permissions',
  'performance',
  'D',
  'performance is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000016',
  '00000000-0002-4000-a000-000000000048',
  16,
  'Q16. What is mobile app?',
  'testing',
  'mobile app',
  'permissions',
  'performance',
  'B',
  'mobile app is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000017',
  '00000000-0002-4000-a000-000000000048',
  17,
  'Q17. Which option is most directly associated with Android?',
  'Android',
  'mobile app',
  'framework',
  'navigation',
  'A',
  'Android is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000018',
  '00000000-0002-4000-a000-000000000048',
  18,
  'Q18. Which statement best describes iOS?',
  'mobile app',
  'app lifecycle',
  'iOS',
  'navigation',
  'C',
  'iOS is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000019',
  '00000000-0002-4000-a000-000000000048',
  19,
  'Q19. In this topic, what does native refer to?',
  'native',
  'authentication',
  'local storage',
  'build',
  'A',
  'native is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000048000020',
  '00000000-0002-4000-a000-000000000048',
  20,
  'Q20. What is cross-platform?',
  'mobile app',
  'cross-platform',
  'UI',
  'store',
  'B',
  'cross-platform is a key concept in Mobile App Development.'
) ON CONFLICT (id) DO NOTHING;

-- Explore Quiz 49: UI/UX Design Basics Challenge Quiz
INSERT INTO public.explore_quizzes (id, title, description, category, branch, difficulty, question_count, estimated_minutes, fx_reward, is_daily, is_published)
VALUES (
  '00000000-0002-4000-a000-000000000049',
  'UI/UX Design Basics Challenge Quiz',
  'Test your knowledge on UI/UX Design Basics with 20 comprehensive questions.',
  'Web3',
  'CSE',
  'Advanced',
  20,
  8,
  15,
  FALSE,
  TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000001',
  '00000000-0002-4000-a000-000000000049',
  1,
  'Q1. What is UI?',
  'spacing',
  'research',
  'component',
  'UI',
  'D',
  'UI is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000002',
  '00000000-0002-4000-a000-000000000049',
  2,
  'Q2. Which option is most directly associated with UX?',
  'component',
  'hierarchy',
  'usability',
  'UX',
  'D',
  'UX is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000003',
  '00000000-0002-4000-a000-000000000049',
  3,
  'Q3. Which statement best describes usability?',
  'usability',
  'UI',
  'typography',
  'design system',
  'A',
  'usability is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000004',
  '00000000-0002-4000-a000-000000000049',
  4,
  'Q4. In this topic, what does user refer to?',
  'accessibility',
  'user',
  'consistency',
  'hierarchy',
  'B',
  'user is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000005',
  '00000000-0002-4000-a000-000000000049',
  5,
  'Q5. What is wireframe?',
  'wireframe',
  'usability',
  'feedback',
  'spacing',
  'A',
  'wireframe is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000006',
  '00000000-0002-4000-a000-000000000049',
  6,
  'Q6. Which option is most directly associated with prototype?',
  'spacing',
  'interaction',
  'prototype',
  'hierarchy',
  'C',
  'prototype is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000007',
  '00000000-0002-4000-a000-000000000049',
  7,
  'Q7. Which statement best describes layout?',
  'user',
  'UI',
  'layout',
  'component',
  'C',
  'layout is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000008',
  '00000000-0002-4000-a000-000000000049',
  8,
  'Q8. In this topic, what does typography refer to?',
  'typography',
  'feedback',
  'design system',
  'hierarchy',
  'A',
  'typography is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000009',
  '00000000-0002-4000-a000-000000000049',
  9,
  'Q9. What is color?',
  'wireframe',
  'typography',
  'color',
  'layout',
  'C',
  'color is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000010',
  '00000000-0002-4000-a000-000000000049',
  10,
  'Q10. Which option is most directly associated with spacing?',
  'research',
  'wireframe',
  'design system',
  'spacing',
  'D',
  'spacing is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000011',
  '00000000-0002-4000-a000-000000000049',
  11,
  'Q11. Which statement best describes component?',
  'component',
  'design system',
  'feedback',
  'usability',
  'A',
  'component is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000012',
  '00000000-0002-4000-a000-000000000049',
  12,
  'Q12. In this topic, what does navigation refer to?',
  'navigation',
  'feedback',
  'design system',
  'consistency',
  'A',
  'navigation is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000013',
  '00000000-0002-4000-a000-000000000049',
  13,
  'Q13. What is accessibility?',
  'wireframe',
  'persona',
  'accessibility',
  'layout',
  'C',
  'accessibility is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000014',
  '00000000-0002-4000-a000-000000000049',
  14,
  'Q14. Which option is most directly associated with feedback?',
  'user',
  'feedback',
  'design system',
  'hierarchy',
  'B',
  'feedback is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000015',
  '00000000-0002-4000-a000-000000000049',
  15,
  'Q15. Which statement best describes consistency?',
  'spacing',
  'consistency',
  'accessibility',
  'user',
  'B',
  'consistency is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000016',
  '00000000-0002-4000-a000-000000000049',
  16,
  'Q16. What is UI?',
  'component',
  'typography',
  'color',
  'UI',
  'D',
  'UI is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000017',
  '00000000-0002-4000-a000-000000000049',
  17,
  'Q17. Which option is most directly associated with UX?',
  'UX',
  'navigation',
  'wireframe',
  'color',
  'A',
  'UX is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000018',
  '00000000-0002-4000-a000-000000000049',
  18,
  'Q18. Which statement best describes usability?',
  'hierarchy',
  'UX',
  'usability',
  'prototype',
  'C',
  'usability is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000019',
  '00000000-0002-4000-a000-000000000049',
  19,
  'Q19. In this topic, what does user refer to?',
  'user',
  'spacing',
  'research',
  'design system',
  'A',
  'user is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.explore_quiz_questions (id, quiz_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
VALUES (
  '00000000-0003-4000-a000-000049000020',
  '00000000-0002-4000-a000-000000000049',
  20,
  'Q20. What is wireframe?',
  'user',
  'wireframe',
  'feedback',
  'typography',
  'B',
  'wireframe is a key concept in UI/UX Design Basics.'
) ON CONFLICT (id) DO NOTHING;

COMMIT;
