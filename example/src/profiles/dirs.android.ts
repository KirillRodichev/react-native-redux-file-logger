import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export const LOGS_DIR =
  Platform.Version >= 29 ? RNFS.ExternalDirectoryPath : RNFS.DownloadDirectoryPath;
