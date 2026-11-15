import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import AttendanceScreen from '../screens/AcademicScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AcademicScreen from '../screens/AcademicScreen';
import OpportunitiesScreen from '../screens/OpportunitiesScreen';
import SupportScreen from '../screens/SupportScreen';
import UpdatesScreen from '../screens/UpdatesScreen';
import TimetableScreen from '../screens/TimetableScreen';
import { COLORS } from '../constants/theme';
import { Ionicons, Feather } from '@expo/vector-icons';
import HapticTab from '../components/haptic-tab';

const Tab = createBottomTabNavigator();

const screenOptions = {
  headerShown: false,
  tabBarShowLabel: false,
  tabBarStyle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    height: 70,
    ...styles.shadow
  }
};

export default function Tabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarButton: (props) => <HapticTab {...props} icon="home-outline" />,
        }}
      />
      <Tab.Screen 
        name="Timetable" 
        component={TimetableScreen} 
        options={{
          tabBarButton: (props) => <HapticTab {...props} icon="calendar-outline" />,
        }}
      />
      <Tab.Screen 
        name="Attendance" 
        component={AttendanceScreen} 
        options={{
          tabBarButton: (props) => <HapticTab {...props} icon="pie-chart-outline" />,
        }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksScreen} 
        options={{
          tabBarButton: (props) => <HapticTab {...props} icon="checkbox-outline" />,
        }}
      />
      <Tab.Screen 
        name="Academics" 
        component={AcademicScreen} 
        options={{
          tabBarButton: (props) => <HapticTab {...props} icon="school-outline" />,
        }}
      />
      <Tab.Screen 
        name="Opportunities" 
        component={OpportunitiesScreen} 
        options={{
          tabBarButton: (props) => <HapticTab {...props} icon="rocket-outline" />,
        }}
      />
      <Tab.Screen 
        name="Support" 
        component={SupportScreen} 
        options={{
          tabBarButton: (props) => <HapticTab {...props} icon="help-buoy-outline" />,
        }}
      />
      <Tab.Screen 
        name="Updates" 
        component={UpdatesScreen} 
        options={{
          tabBarButton: (props) => <HapticTab {...props} icon="notifications-outline" />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarButton: (props) => <HapticTab {...props} icon="person-outline" />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = {
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  }
}