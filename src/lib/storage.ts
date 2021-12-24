import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';

import { storage } from './firebase';

export const uploadDoc = async (file: File, address: string) => {
  const storageRef = ref(
    storage,
    `${address}/${v4()}.${file.name.split('.').pop()}`
  );
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url.toString();
};
