export type YesNo = 'Yes' | 'No' | '';

export interface AddressInfo {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface ParentInfo {
  name: string;
  occupation: string;
}

export interface BioData {
  // Personal
  name: string;
  dob: string; // ISO date string (yyyy-mm-dd) from <input type="date">
  gender: string; // free-text so users can choose desired wording
  placeOfBirth: string;
  hinduRashi: string;
  gotra: string;
  heightFt: number | null;
  heightIn: number | null;
  complexion: string;
  bloodGroup: string;

  // Contact
  email: string;
  phone: string;

  // Profile
  about: string;
  hobbies: string[];

  // Education & Work
  education: string;
  college: string;
  passoutYear: string;
  jobTitle: string;
  employer: string;

  // Addresses (optional — preview omits section when both are empty)
  currentAddress: AddressInfo;
  permanentAddress: AddressInfo;

  // Parents & siblings (name + occupation / details — same shape as parents)
  parents: {
    father: ParentInfo;
    mother: ParentInfo;
  };
  siblings: {
    brother: ParentInfo;
    sister: ParentInfo;
  };

  // Marriage purpose / other notes
  marriagePreferences: string;
  otherInformation: string;

  // Optional extras
  manglik: YesNo;
  diet: string;

  // Photo (data URL for preview + PDF)
  photoDataUrl: string | null;
}

export const EMPTY_ADDRESS: AddressInfo = {
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
};

export const EMPTY_PARENT: ParentInfo = {
  name: '',
  occupation: '',
};

export const EMPTY_BIO_DATA: BioData = {
  name: '',
  dob: '',
  gender: '',
  placeOfBirth: '',
  hinduRashi: '',
  gotra: '',
  heightFt: null,
  heightIn: null,
  complexion: '',
  bloodGroup: '',

  email: '',
  phone: '',

  about: '',
  hobbies: [],

  education: '',
  college: '',
  passoutYear: '',
  jobTitle: '',
  employer: '',

  currentAddress: { ...EMPTY_ADDRESS },
  permanentAddress: { ...EMPTY_ADDRESS },

  parents: {
    father: { ...EMPTY_PARENT },
    mother: { ...EMPTY_PARENT },
  },
  siblings: {
    brother: { ...EMPTY_PARENT },
    sister: { ...EMPTY_PARENT },
  },

  marriagePreferences: '',
  otherInformation: '',

  manglik: '',
  diet: '',

  photoDataUrl: null,
};

