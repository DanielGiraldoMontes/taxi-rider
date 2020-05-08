import { createStackNavigator} from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { 
    DriverTripCompleteSreen, 
    ProfileScreen,
    CardDetailsScreen, 
    RideListPage, 
    NotificationPage, 
    MapScreen, 
    BookedCabScreen,
    RegistrationPage,
    LoginScreen,
    FareScreen,
    RideDetails,
    SearchScreen,
    EditProfilePage ,
    TrackNow,
    AboutPage,
    OnlineChat,
    WalletDetails,
    AddMoneyScreen,
    SelectGatewayPage
} from '../screens';
import SideMenu from '../components/SideMenu';

//app stack for user end
    export const AppStack = {
        ratingPage: {
            screen: DriverTripCompleteSreen,
            navigationOptions:{
                header: null
            }
        },
        RideList:{
            screen: RideListPage,
            navigationOptions:{
            header:null,
            }
            
        },
        Notifications:{
            screen:NotificationPage,
            navigationOptions:{
                header:null,
                }
        },
        
        Profile: {
            screen: ProfileScreen,
            navigationOptions:{
                header: null
            }
        },
        CardDetails: {
            screen: CardDetailsScreen,
            navigationOptions:{
                header: null
            }
        },
        About: {
            screen: AboutPage,
            navigationOptions:{
                header: null
            }
        },
        Map: {
            screen: MapScreen,
            navigationOptions:{
                header: null
            }
        },
        onlineChat:{
            screen:OnlineChat,
            navigationOptions:{
                header: null
            }
        },
        BookedCab: {
            screen: BookedCabScreen,
            navigationOptions:{
                header: null
            }
        },
                
        FareDetails: {
            screen: FareScreen,
            navigationOptions:{
                header:null,
            }
        },
        RideDetails: {
            screen: RideDetails,
            navigationOptions: {
                header: null
            }
        },
        
        Search: {
            screen:  SearchScreen,
            navigationOptions:{
                header: null
            } 
        },
        editUser:{
            screen: EditProfilePage,
            navigationOptions:{
                header: null
            } 

        },
        trackRide:{
            screen: TrackNow,
            navigationOptions:{
                header: null
            } 

        },
        wallet:{
            screen: WalletDetails,
            navigationOptions:{
                header: null
            } 

        },
        addMoney:{
            screen:AddMoneyScreen,
            navigationOptions:{
                header: null
            }
        },
       
        paymentMethod:{
            screen:SelectGatewayPage,
            navigationOptions:{
                header: null
            }
        }
        
        
        
    }

    //authentication stack for user before login
    export const AuthStack = createStackNavigator({
       
        Reg: {
            screen: RegistrationPage,
            navigationOptions:{
            header:null,
            }
        },
        Login: {
            screen: LoginScreen,
            navigationOptions:{
                header:null,
            }
        }
           
    },{
        initialRouteName: 'Login',
    });

    //drawer routes, you can add routes here for drawer or sidemenu
    const DrawerRoutes = {
        
        'Map': {
            name: 'Map',
            screen: createStackNavigator(AppStack, {
                initialRouteName: 'Map', 
                navigationOptions:{
                    header: null
                } 
            })
        },
        'RideList': {
            name: 'RideList',
            screen: createStackNavigator(AppStack, { initialRouteName: 'RideList',headerMode: 'none' })
        },
        'Profile': {
            name: 'Profile',
            screen: createStackNavigator(AppStack, { initialRouteName: 'Profile', headerMode: 'none' })
        },
        'About': {
            name: 'About',
            screen: createStackNavigator(AppStack, { initialRouteName: 'About', headerMode: 'none' })
        },
        'Notifications': {
            name: 'Notifications',
            screen: createStackNavigator(AppStack, { initialRouteName: 'Notifications', headerMode: 'none' })
        },
        'CardDetails': {
            name: 'CardDetails',
            screen: createStackNavigator(AppStack, { initialRouteName: 'CardDetails', headerMode: 'none' })
        },
        'wallet': {
            name: 'wallet',
            screen: createStackNavigator(AppStack, { initialRouteName: 'wallet', headerMode: 'none' })
        },
    };

    //main navigator for user end
    export const RootNavigator = createDrawerNavigator(
        DrawerRoutes,
        {
        drawerWidth: 180,
        initialRouteName:'Map',
        contentComponent: SideMenu,
      });



