import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BorderArtId } from '../models/biodata-designs';

@Component({
  selector: 'app-biodata-design-border',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './biodata-design-border.component.html',
  styleUrl: './biodata-design-border.component.css',
})
export class BioDataDesignBorderComponent implements OnInit, OnChanges {
  @Input({ required: true }) borderArtId!: BorderArtId;
  /** Unique per instance (e.g. design id) so thumbnail SVGs don’t collide on gradient ids */
  @Input() svgIdSuffix = 'main';

  /** Sanitized fragment for SVG ids */
  sid = 'main';

  ngOnInit(): void {
    this.refreshSid();
  }

  ngOnChanges(): void {
    this.refreshSid();
  }

  private refreshSid(): void {
    const raw = this.svgIdSuffix?.trim() || 'main';
    this.sid = String(raw).replace(/[^a-zA-Z0-9_-]/g, '-') || 'main';
  }
}
