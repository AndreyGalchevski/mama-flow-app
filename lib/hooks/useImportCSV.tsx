import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';

export default function useImportCSV() {
  const router = useRouter();

  const handleImportCSVPress = async () => {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });

    if (result.canceled) {
      return;
    }

    router.push({ pathname: '/import-csv-modal', params: { csvURI: result.assets[0].uri } });
  };

  return {
    handleImportCSVPress,
  };
}
