import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../ThemeProvider";
import * as Haptics from 'expo-haptics';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { clearAsyncStorage } from '../../../api/helperFuncs';
import { calculateScore } from '../../../api/score';
import { fetchPublicUserData, togglePrivateActiveSplitMode, togglePrivateScoreMode } from '../../../api/profile';

const { height, width } = Dimensions.get('window');

const AccountComponent = () => {
    const [showActiveSplit, setShowActiveSplit] = useState(false);
    const [showScores, setShowScores] = useState(false);
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const navigation = useNavigation();

    const activeSplitRef = useRef(false);
    const scoresRef = useRef(false);
    const isSwitchTogglingRef = useRef(false);

    const [activeSplitCooldown, setActiveSplitCooldown] = useState(false);
    const [scoresCooldown, setScoresCooldown] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const publicUserData = await fetchPublicUserData();
                if(publicUserData){
                    setShowActiveSplit(publicUserData.privateActiveSplitMode);
                    setShowScores(publicUserData.privateScoreMode);
                }
                
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchData();
    }, []);

    const handleProfileEdit = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        navigation.navigate("ProfileEdit")
    };

    const handleOnboard = () => {
        navigation.navigate("Onboarding");
    }

    const handleUpdateScores = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        navigation.navigate("UpdateScores");
    }

    const toggleSwitch = async (type) => {
        if (isSwitchTogglingRef.current || (type === 'activeSplit' && activeSplitCooldown) || (type === 'scores' && scoresCooldown)) {
            return;
        }

        isSwitchTogglingRef.current = true; // Lock toggling

        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

            if (type === 'activeSplit') {
                setShowActiveSplit(prevState => {
                    const newState = !prevState;
                    activeSplitRef.current = newState; // Update ref with new state
                    return newState;
                });
                await togglePrivateActiveSplitMode();
                setActiveSplitCooldown(true); // Set cooldown
                setTimeout(() => setActiveSplitCooldown(false), 1); // Cooldown period (0.01 second)
            } else if (type === 'scores') {
                setShowScores(prevState => {
                    const newState = !prevState;
                    scoresRef.current = newState; // Update ref with new state
                    return newState;
                });
                await togglePrivateScoreMode();
                setScoresCooldown(true); // Set cooldown
                setTimeout(() => setScoresCooldown(false), 1); // Cooldown period (1 second)
            }

        } catch (error) {
            console.error(`Error toggling ${type} mode:`, error);
        } finally {
            isSwitchTogglingRef.current = false; // Unlock toggling
        }
    };

    return (
        <View>
            <Text style={styles.header}>Account</Text>
            <View style={styles.container}>
                <TouchableOpacity style={styles.row} onPress={handleProfileEdit}>
                    <MaterialCommunityIcons name="account-edit-outline" size={getResponsiveFontSize(24)} style={styles.icon} />
                    <Text style={styles.text}>Edit Profile</Text>
                </TouchableOpacity>
                <View style={styles.row}>
                    <Ionicons name="lock-closed" size={getResponsiveFontSize(24)} style={styles.icon} />
                    <Text style={styles.text}>Privacy</Text>
                </View>
                <View style={styles.subRow}>
                    <Text style={styles.subText}>Show active split on profile</Text>
                    <Switch
                        value={showActiveSplit}
                        onValueChange={() => toggleSwitch('activeSplit')}
                        disabled={isSwitchTogglingRef.current || scoresCooldown}
                        trackColor={{ false: theme.grayTextColor, true: theme.primaryColor }}
                        thumbColor={showActiveSplit ? theme.textColor : theme.textColor}
                        style={styles.switch}
                    />
                </View>
                <View style={styles.subRow}>
                    <Text style={styles.subText}>Show scores on profile</Text>
                    <Switch
                        value={showScores}
                        onValueChange={() => toggleSwitch('scores')}
                        disabled={isSwitchTogglingRef.current || activeSplitCooldown}
                        trackColor={{ false: theme.grayTextColor, true: theme.primaryColor }}
                        thumbColor={showScores ? theme.textColor : theme.textColor}
                        style={styles.switch}
                    />
                </View>
                <TouchableOpacity style={styles.row} onPress={handleUpdateScores}>
                    <MaterialCommunityIcons name="update" size={getResponsiveFontSize(24)} style={styles.icon} />
                    <Text style={styles.text}>Update Scores</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row} onPress = {handleOnboard}>
                    <MaterialCommunityIcons name="ab-testing" size={getResponsiveFontSize(24)} style={styles.icon} />
                    <Text style={styles.text}>Onboard Testing</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};
    
const createStyles = (theme) => StyleSheet.create({    
    header: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(20),
        fontWeight: '800',
        paddingBottom: 20,
        marginLeft: 10
    },
    container: {
        paddingHorizontal: 26,
        paddingVertical: 16,
        backgroundColor: theme.backdropColor,
        borderRadius: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    subRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingLeft: 32,
    },
    icon: {
        marginRight: 16,
        color: theme.grayTextColor
    },
    text: {
        fontSize: getResponsiveFontSize(16),
        color: theme.textColor,
        fontWeight: 'bold'
    },
    subText: {
        fontSize: getResponsiveFontSize(14),
        color: theme.textColor,
    },
    switch: {
        marginLeft: 70
    }
});

export default AccountComponent;