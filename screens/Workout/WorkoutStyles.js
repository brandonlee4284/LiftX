import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    splitContainer: {
        marginBottom: 20,
        alignItems: 'flex-start',
    },
    splitTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        margin: 15,
    },
    horizontalFlatListContent: {
        paddingHorizontal: 10,
    },
    dayCard: {
        alignItems: 'center',
        width: width * 0.30,
        backgroundColor: '#e0e0e0',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 5,
        padding: 10,
    },
    dayText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    exerciseCard: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
        paddingHorizontal: 5,
        marginBottom: 5,
    },
    exerciseCardPopup: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '100%',
        paddingHorizontal: 5,
        marginBottom: 5,
    },
    exercisePopupContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '100%',
    },
    exerciseText: {
        fontSize: 14,
    },
    exerciseTextPopup: {
        fontSize: 16,
        textAlign: 'left',
    },
    exerciseList: {
        paddingBottom: 20,
    },
    verticalFlatListContent: {
        paddingVertical: 20,
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: 'lightgray',
        marginTop: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    modalBody: {},
    removeButton: {
        fontSize: 16,
        color: 'red',
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
});
