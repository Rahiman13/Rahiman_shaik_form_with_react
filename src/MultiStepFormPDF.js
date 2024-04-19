import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    marginBottom: 10,
  },
});

// Create PDF component
const MultiStepFormPDF = ({ formData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Form Preview</Text>

        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{formData.name}</Text>

        <Text style={styles.label}>Surname:</Text>
        <Text style={styles.value}>{formData.surname}</Text>

        {/* Add more fields as needed */}
      </View>
    </Page>
  </Document>
);

export default MultiStepFormPDF;
