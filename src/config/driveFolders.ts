export interface DriveFolder {
  id: string;
  title: string;
  folderId: string;
  type?: 'drive' | 'photos';
  sharedLink?: string;
}

export const driveFolders: Record<string, DriveFolder> = {
  panorama: {
    id: 'panorama',
    title: 'Panorama Gallery',
    folderId: '1nkaUS4tu2UIX9yD1x3T-6NI0DQK6L8-U',
    type: 'drive'
  },
  basemap: {
    id: 'basemap',
    title: 'Base Map Gallery',
    folderId: '1kUGw4LGoyQqpxfQofPWyXRf1546eAibn',
    type: 'drive'
  },
  elevation: {
    id: 'elevation',
    title: 'Elevation Map Gallery',
    folderId: '',
    type: 'photos',
    sharedLink: 'https://photos.app.goo.gl/cgKzq3foeL54wdsB8'
  },
  evacuation: {
    id: 'evacuation',
    title: 'Evacuation Gallery',
    folderId: '',
    type: 'photos',
    sharedLink: 'https://photos.app.goo.gl/cgKzq3foeL54wdsB8'
  },
  hazards: {
    id: 'hazards',
    title: 'Hazards Gallery',
    folderId: '',
    type: 'photos',
    sharedLink: 'https://photos.app.goo.gl/cgKzq3foeL54wdsB8'
  },
  purok: {
    id: 'purok',
    title: 'Purok Boundary Maps',
    folderId: '1XLA91HwmfO_mvrQx4t_4C7GbEwMDst-J'
  },
  barangay: {
    id: 'barangay',
    title: 'Barangay Boundary Maps',
    folderId: '1XLA91HwmfO_mvrQx4t_4C7GbEwMDst-J'
  },
  municipal: {
    id: 'municipal',
    title: 'Municipal Boundary Maps',
    folderId: '1XLA91HwmfO_mvrQx4t_4C7GbEwMDst-J'
  },
  interactive: {
    id: 'interactive',
    title: 'Interactive Maps',
    folderId: '1XLA91HwmfO_mvrQx4t_4C7GbEwMDst-J'
  }
};

export async function getAllDriveFolders(): Promise<Record<string, DriveFolder>> {
  try {
    const res = await fetch('/api/sidebar-buttons');
    if (res.ok) {
      const data = await res.json();
      const customFolders: Record<string, DriveFolder> = {};
      
      data.buttons?.forEach((btn: any) => {
        if (btn.is_enabled) {
          customFolders[btn.button_id] = {
            id: btn.button_id,
            title: btn.label,
            folderId: btn.folder_id
          };
        }
      });
      
      return { ...driveFolders, ...customFolders };
    }
  } catch (err) {
    console.error('Failed to load custom folders:', err);
  }
  
  return driveFolders;
}
