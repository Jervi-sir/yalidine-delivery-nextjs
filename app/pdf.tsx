import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  gridContainer: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  parcelBox: { width: '48%', border: '1px solid black', padding: 10, marginBottom: 10 },
  title: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  text: { fontSize: 10 },
});

const ParcelPDF = ({ parcels = [0,0,0,0,0,0] }) => {
  // Group parcels in sets of 4 per page
  const groupedParcels = [];
  for (let i = 0; i < parcels.length; i += 4) {
    groupedParcels.push(parcels.slice(i, i + 4));
  }

  return (
    <Document>
      {groupedParcels.map((group, pageIndex) => (
        <Page size="A4" key={pageIndex} style={styles.page}>
          <View style={styles.gridContainer}>
            {group.map((parcel, index) => (
              <View key={index} style={styles.parcelBox}>
                <Text style={styles.title}>Expéditeur: {parcel.sender}</Text>
                <Text style={styles.text}>Destinataire: {parcel.receiver}</Text>
                <Text style={styles.text}>Tracking: {parcel.trackingNumber}</Text>
                <Text style={styles.text}>Téléphone: {parcel.phone}</Text>
              </View>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default ParcelPDF;
