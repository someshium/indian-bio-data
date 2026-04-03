import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BioData, EMPTY_ADDRESS } from '../models/biodata.model';
import { BioDataDesign } from '../models/biodata-designs';
import { BioDataDesignBorderComponent } from '../biodata-design-border/biodata-design-border.component';

export interface AttrLine {
  label: string;
  value: string;
}

@Component({
  selector: 'app-biodata-preview',
  standalone: true,
  imports: [CommonModule, BioDataDesignBorderComponent],
  templateUrl: './biodata-preview.component.html',
  styleUrl: './biodata-preview.component.css',
})
export class BioDataPreviewComponent {
  @Input({ required: true }) bioData!: BioData;
  @Input({ required: true }) design!: BioDataDesign;

  @ViewChild('pageRoot', { static: true }) pageRoot!: ElementRef<HTMLDivElement>;

  // Called by parent to generate the PDF from the exact preview page.
  getPrintableElement(): HTMLElement {
    return this.pageRoot.nativeElement;
  }

  pageStyle(): Record<string, string> {
    const t = this.design.theme;
    return {
      background: t.pageGradient ?? t.pageBg,
      color: t.ink,
      '--ink': t.ink,
      '--ink-soft': t.inkSoft,
      '--muted': t.muted,
      '--gold': t.accent,
      '--gold-soft': t.accentSoft,
      '--cream': t.cream,
      '--cream-deep': t.creamDeep,
      '--ledger-inset': t.ledgerInset ?? '9mm',
    };
  }

  formatDob(dob: string): string {
    if (!dob) return '';
    const date = new Date(dob + 'T00:00:00');
    if (Number.isNaN(date.getTime())) return dob;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  ageText(dob: string): string {
    if (!dob) return '';
    const d = new Date(dob + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return '';
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
    if (age < 0 || !Number.isFinite(age)) return '';
    return `${age} yrs`;
  }

  heightText(ft: number | null, inches: number | null): string {
    const f = ft ?? null;
    const i = inches ?? null;
    if (f === null && i === null) return '';
    if (f !== null && (i === null || i === 0)) return `${f} ft`;
    if (f === null && i !== null) return `${i} in`;
    return `${f} ft ${i} in`;
  }

  hasText(v: unknown): boolean {
    return typeof v === 'string' && v.trim().length > 0;
  }

  hasAny(...values: unknown[]): boolean {
    return values.some((v) => this.hasText(v));
  }

  hasHobbies(): boolean {
    return Array.isArray(this.bioData?.hobbies) && this.bioData.hobbies.length > 0;
  }

  /**
   * True when the address has user-visible content. A lone default country of "India"
   * (with empty line/city/state/pincode) does not count — matches optional addresses in the form.
   */
  hasAddress(addr: BioData['currentAddress'] | typeof EMPTY_ADDRESS): boolean {
    const coreFilled = [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].some(
      (x) => typeof x === 'string' && x.trim().length > 0
    );
    if (coreFilled) return true;
    const country = String(addr.country ?? '').trim();
    if (!country) return false;
    return country.toLowerCase() !== 'india';
  }

  addressLines(addr: BioData['currentAddress'] | typeof EMPTY_ADDRESS): string[] {
    const lines = [addr.line1, addr.line2, addr.city, addr.state, addr.pincode, addr.country].filter(
      (x) => typeof x === 'string' && x.trim().length > 0
    );
    return lines;
  }

  /** One label + value per row for the header “quick facts” (vertical list, each row one line). */
  quickLines(): AttrLine[] {
    const b = this.bioData;
    const out: AttrLine[] = [];
    const h = this.heightText(b.heightFt, b.heightIn);
    if (h) out.push({ label: 'Height', value: h });
    if (this.hasText(b.bloodGroup)) out.push({ label: 'Blood group', value: b.bloodGroup });
    if (this.hasText(b.complexion)) out.push({ label: 'Complexion', value: b.complexion });
    if (this.hasText(b.placeOfBirth)) out.push({ label: 'Place of birth', value: b.placeOfBirth });
    if (this.hasText(b.hinduRashi)) out.push({ label: 'Rashi', value: b.hinduRashi });
    if (this.hasText(b.gotra)) out.push({ label: 'Gotra', value: b.gotra });
    if (this.hasText(b.diet)) out.push({ label: 'Diet', value: b.diet });
    if (this.hasText(b.manglik)) out.push({ label: 'Manglik', value: b.manglik });
    return out;
  }

  careerLines(): AttrLine[] {
    const b = this.bioData;
    const out: AttrLine[] = [];
    if (this.hasText(b.jobTitle)) out.push({ label: 'Job', value: b.jobTitle });
    if (this.hasText(b.employer)) out.push({ label: 'Employer', value: b.employer });
    if (this.hasText(b.education)) out.push({ label: 'Education', value: b.education });
    if (this.hasText(b.college)) out.push({ label: 'College', value: b.college });
    if (this.hasText(b.passoutYear)) out.push({ label: 'Year of passout', value: b.passoutYear });
    return out;
  }
}

