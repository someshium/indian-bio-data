import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BioData, EMPTY_BIO_DATA, EMPTY_ADDRESS, EMPTY_PARENT, AddressInfo } from '../models/biodata.model';
import { BIO_DATA_DESIGNS, BioDataDesign, BioDataDesignId, bioDataDesignById } from '../models/biodata-designs';
import { BioDataDesignBorderComponent } from '../biodata-design-border/biodata-design-border.component';
import { BioDataPreviewComponent } from '../biodata-preview/biodata-preview.component';

type AddressForm = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

/** Wait so html2canvas sees decoded dimensions for every img inside the capture root. */
function waitForImagesInElement(container: HTMLElement): Promise<void> {
  const imgs = Array.from(container.querySelectorAll('img'));
  return Promise.all(
    imgs.map(
      (img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.addEventListener('load', () => resolve(), { once: true });
              img.addEventListener('error', () => resolve(), { once: true });
            })
    )
  ).then(() => undefined);
}

/**
 * html2canvas mishandles object-fit: cover and often stretches the bitmap into the img box.
 * Replace each preview photo in the *clone* with a canvas that applies the same cover crop
 * as the browser, drawing from the live (original) image — matches what the user sees.
 */
function snapshotCoverPhotosForHtml2Clone(originalRoot: HTMLElement, clonedRoot: HTMLElement): void {
  const orig = originalRoot.querySelectorAll<HTMLImageElement>('img.photo');
  const clone = clonedRoot.querySelectorAll<HTMLImageElement>('img.photo');
  const n = Math.min(orig.length, clone.length);
  for (let i = 0; i < n; i++) {
    const srcImg = orig[i];
    const destImg = clone[i];
    const nw = srcImg.naturalWidth;
    const nh = srcImg.naturalHeight;
    if (!nw || !nh) continue;

    const w = Math.max(1, Math.round(srcImg.offsetWidth));
    const h = Math.max(1, Math.round(srcImg.offsetHeight));

    const doc = destImg.ownerDocument;
    const cnv = doc.createElement('canvas');
    cnv.width = w;
    cnv.height = h;
    const ctx = cnv.getContext('2d');
    if (!ctx) continue;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const scale = Math.max(w / nw, h / nh);
    const dw = nw * scale;
    const dh = nh * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    try {
      ctx.drawImage(srcImg, dx, dy, dw, dh);
    } catch {
      continue;
    }

    cnv.className = destImg.className;
    cnv.setAttribute('alt', destImg.getAttribute('alt') || '');
    cnv.style.display = getComputedStyle(destImg).display || 'block';
    cnv.style.width = `${w}px`;
    cnv.style.height = `${h}px`;
    const parent = destImg.parentNode;
    if (parent) {
      parent.replaceChild(cnv, destImg);
    }
  }
}

/** Sample data so the preview is useful on first load; users can edit or clear fields. */
const SAMPLE_FORM_DEFAULTS = {
  name: 'First Last',
  dob: 'YYYY-MM-DD',
  gender: 'Male',
  placeOfBirth: 'City, State',
  hinduRashi: '',
  gotra: 'Gotra',
  heightFt: '5',
  heightIn: '11',
  complexion: '',
  bloodGroup: 'B+',
  email: 'email@gmail.com',
  phone: '',
  about: 'A person who loves running and simplicity',
  hobbies: 'Running, Reading, Travel',
  education: 'B.Tech',
  college: 'IIT Delhi',
  passoutYear: '2020',
  jobTitle: 'Software Engineer',
  employer: 'Organisation',
  currentAddress: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  },
  permanentAddress: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  },
  parents: {
    father: {
      name: 'First Last',
      occupation: 'Occupation',
    },
    mother: {
      name: 'First Last',
      occupation: 'Occupation',
    },
  },
  siblings: {
    brother: {
      name: '',
      occupation: '',
    },
    sister: {
      name: '',
      occupation: '',
    },
  },
  marriagePreferences: '',
  otherInformation: '',
  manglik: 'No',
  diet: 'Vegetarian',
  photoDataUrl: null as string | null,
};

@Component({
  selector: 'app-biodata-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BioDataPreviewComponent, BioDataDesignBorderComponent],
  templateUrl: './biodata-builder.component.html',
  styleUrl: './biodata-builder.component.css',
})
export class BioDataBuilderComponent {
  designs = BIO_DATA_DESIGNS;
  designId: BioDataDesignId = BIO_DATA_DESIGNS[0].id;

  get activeDesign(): BioDataDesign {
    return bioDataDesignById(this.designId);
  }

  // Standalone form group (kept untyped for easier compatibility with Angular strict mode).
  bioForm = this.fb.group({
    name: [SAMPLE_FORM_DEFAULTS.name, Validators.required],
    dob: [SAMPLE_FORM_DEFAULTS.dob, Validators.required],
    gender: [SAMPLE_FORM_DEFAULTS.gender],
    placeOfBirth: [SAMPLE_FORM_DEFAULTS.placeOfBirth],
    hinduRashi: [SAMPLE_FORM_DEFAULTS.hinduRashi],
    gotra: [SAMPLE_FORM_DEFAULTS.gotra],
    heightFt: [SAMPLE_FORM_DEFAULTS.heightFt],
    heightIn: [SAMPLE_FORM_DEFAULTS.heightIn],
    complexion: [SAMPLE_FORM_DEFAULTS.complexion],
    bloodGroup: [SAMPLE_FORM_DEFAULTS.bloodGroup],

    email: [SAMPLE_FORM_DEFAULTS.email],
    phone: [SAMPLE_FORM_DEFAULTS.phone],

    about: [SAMPLE_FORM_DEFAULTS.about],
    hobbies: [SAMPLE_FORM_DEFAULTS.hobbies],

    education: [SAMPLE_FORM_DEFAULTS.education],
    college: [SAMPLE_FORM_DEFAULTS.college],
    passoutYear: [SAMPLE_FORM_DEFAULTS.passoutYear],
    jobTitle: [SAMPLE_FORM_DEFAULTS.jobTitle],
    employer: [SAMPLE_FORM_DEFAULTS.employer],

    currentAddress: this.fb.group({
      line1: [SAMPLE_FORM_DEFAULTS.currentAddress.line1],
      line2: [SAMPLE_FORM_DEFAULTS.currentAddress.line2],
      city: [SAMPLE_FORM_DEFAULTS.currentAddress.city],
      state: [SAMPLE_FORM_DEFAULTS.currentAddress.state],
      pincode: [SAMPLE_FORM_DEFAULTS.currentAddress.pincode],
      country: [SAMPLE_FORM_DEFAULTS.currentAddress.country],
    }),
    permanentAddress: this.fb.group({
      line1: [SAMPLE_FORM_DEFAULTS.permanentAddress.line1],
      line2: [SAMPLE_FORM_DEFAULTS.permanentAddress.line2],
      city: [SAMPLE_FORM_DEFAULTS.permanentAddress.city],
      state: [SAMPLE_FORM_DEFAULTS.permanentAddress.state],
      pincode: [SAMPLE_FORM_DEFAULTS.permanentAddress.pincode],
      country: [SAMPLE_FORM_DEFAULTS.permanentAddress.country],
    }),

    parents: this.fb.group({
      father: this.fb.group({
        name: [SAMPLE_FORM_DEFAULTS.parents.father.name],
        occupation: [SAMPLE_FORM_DEFAULTS.parents.father.occupation],
      }),
      mother: this.fb.group({
        name: [SAMPLE_FORM_DEFAULTS.parents.mother.name],
        occupation: [SAMPLE_FORM_DEFAULTS.parents.mother.occupation],
      }),
    }),
    siblings: this.fb.group({
      brother: this.fb.group({
        name: [SAMPLE_FORM_DEFAULTS.siblings.brother.name],
        occupation: [SAMPLE_FORM_DEFAULTS.siblings.brother.occupation],
      }),
      sister: this.fb.group({
        name: [SAMPLE_FORM_DEFAULTS.siblings.sister.name],
        occupation: [SAMPLE_FORM_DEFAULTS.siblings.sister.occupation],
      }),
    }),

    marriagePreferences: [SAMPLE_FORM_DEFAULTS.marriagePreferences],
    otherInformation: [SAMPLE_FORM_DEFAULTS.otherInformation],
    manglik: [SAMPLE_FORM_DEFAULTS.manglik],
    diet: [SAMPLE_FORM_DEFAULTS.diet],

    photoDataUrl: [SAMPLE_FORM_DEFAULTS.photoDataUrl],
  });

  bioData: BioData = { ...EMPTY_BIO_DATA };
  downloading = false;

  @ViewChild(BioDataPreviewComponent) previewComp!: BioDataPreviewComponent;

  constructor(private fb: FormBuilder) {
    this.bioData = this.toBioData();
    this.bioForm.valueChanges.subscribe(() => {
      this.bioData = this.toBioData();
    });
  }

  private toAddress(groupValue: AddressForm | AddressInfo | any): AddressInfo {
    return {
      line1: String(groupValue?.line1 ?? ''),
      line2: String(groupValue?.line2 ?? ''),
      city: String(groupValue?.city ?? ''),
      state: String(groupValue?.state ?? ''),
      pincode: String(groupValue?.pincode ?? ''),
      country: String(groupValue?.country ?? 'India'),
    };
  }

  private toHeight(heightValue: unknown): number | null {
    const n = typeof heightValue === 'number' ? heightValue : Number(String(heightValue ?? '').trim());
    if (!Number.isFinite(n) || n <= 0) return null;
    return n;
  }

  private toNonNegativeInt(value: unknown): number | null {
    const n = typeof value === 'number' ? value : Number(String(value ?? '').trim());
    if (!Number.isFinite(n) || n < 0) return null;
    return Math.floor(n);
  }

  private toBioData(): BioData {
    const v = this.bioForm.getRawValue();
    const manglikRaw = String(v.manglik ?? '');
    const manglik: BioData['manglik'] =
      manglikRaw === 'Yes' || manglikRaw === 'No' ? (manglikRaw as BioData['manglik']) : '';
    const hobbies = String(v.hobbies ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return {
      ...EMPTY_BIO_DATA,
      name: String(v.name ?? ''),
      dob: String(v.dob ?? ''),
      gender: String(v.gender ?? ''),
      placeOfBirth: String(v.placeOfBirth ?? ''),
      hinduRashi: String(v.hinduRashi ?? ''),
      gotra: String(v.gotra ?? ''),
      heightFt: this.toNonNegativeInt(v.heightFt),
      heightIn: this.toNonNegativeInt(v.heightIn),
      complexion: String(v.complexion ?? ''),
      bloodGroup: String(v.bloodGroup ?? ''),

      email: String(v.email ?? ''),
      phone: String(v.phone ?? ''),

      about: String(v.about ?? ''),
      hobbies,

      education: String(v.education ?? ''),
      college: String(v.college ?? ''),
      passoutYear: String(v.passoutYear ?? ''),
      jobTitle: String(v.jobTitle ?? ''),
      employer: String(v.employer ?? ''),

      currentAddress: this.toAddress(v.currentAddress),
      permanentAddress: this.toAddress(v.permanentAddress),

      parents: {
        father: {
          name: String(v.parents?.father?.name ?? EMPTY_PARENT.name),
          occupation: String(v.parents?.father?.occupation ?? EMPTY_PARENT.occupation),
        },
        mother: {
          name: String(v.parents?.mother?.name ?? EMPTY_PARENT.name),
          occupation: String(v.parents?.mother?.occupation ?? EMPTY_PARENT.occupation),
        },
      },
      siblings: {
        brother: {
          name: String(v.siblings?.brother?.name ?? EMPTY_PARENT.name),
          occupation: String(v.siblings?.brother?.occupation ?? EMPTY_PARENT.occupation),
        },
        sister: {
          name: String(v.siblings?.sister?.name ?? EMPTY_PARENT.name),
          occupation: String(v.siblings?.sister?.occupation ?? EMPTY_PARENT.occupation),
        },
      },

      marriagePreferences: String(v.marriagePreferences ?? ''),
      otherInformation: String(v.otherInformation ?? ''),
      manglik,
      diet: String(v.diet ?? ''),

      photoDataUrl: v.photoDataUrl ? String(v.photoDataUrl) : null,
    };
  }

  async onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Keep it light for in-browser preview and PDF generation.
    const maxSizeBytes = 3.5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert('Image is too large. Please use an image under ~3.5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        this.bioForm.patchValue({ photoDataUrl: result });
      }
    };
    reader.readAsDataURL(file);
  }

  async downloadPdf() {
    if (this.downloading) return;
    if (!this.previewComp) {
      alert('Preview is not ready yet. Try again in a moment.');
      return;
    }
    this.downloading = true;

    try {
      await new Promise((r) => setTimeout(r, 50));
      await document.fonts.ready;

      const el = this.previewComp.getPrintableElement();
      el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      await waitForImagesInElement(el);

      const canvas = await html2canvas(el, {
        scale: 2.2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (_documentClone, clonedPage) => {
          snapshotCoverPhotosForHtml2Clone(el, clonedPage);
        },
      });

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Keep aspect ratio while fitting into A4.
      const imgWidthMm = pageWidth;
      const imgHeightMmRaw = (canvas.height * imgWidthMm) / canvas.width;

      let imgWidthFinal = imgWidthMm;
      let imgHeightFinal = imgHeightMmRaw;

      if (imgHeightFinal > pageHeight) {
        imgHeightFinal = pageHeight;
        imgWidthFinal = (canvas.width * imgHeightFinal) / canvas.height;
      }

      const x = (pageWidth - imgWidthFinal) / 2;
      const y = 0;

      pdf.addImage(canvas, 'PNG', x, y, imgWidthFinal, imgHeightFinal);
      pdf.save('bio-data.pdf');
    } catch (err) {
      console.error(err);
      alert('PDF generation failed. Try again with fewer/shorter notes.');
    } finally {
      this.downloading = false;
    }
  }
}

