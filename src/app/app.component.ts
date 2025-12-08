import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  title = 'sign';

  @ViewChild('sigCanvas') sigCanvas!: ElementRef<HTMLCanvasElement>;
  private signaturePad?: SignaturePad;

  ngAfterViewInit(): void {
    const canvas = this.sigCanvas.nativeElement;
    this.resizeCanvas(canvas);
    this.signaturePad = new SignaturePad(canvas, {
      backgroundColor: '#ffffff',
      penColor: '#000000',
    });

    window.addEventListener('resize', () => {
      const data = this.signaturePad?.toData();
      this.resizeCanvas(canvas);
      if (data && this.signaturePad) {
        this.signaturePad.fromData(data);
      }
    });
  }

  clear(): void {
    this.signaturePad?.clear();
  }

  savePng(): void {
    if (!this.signaturePad || this.signaturePad.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }
    const dataUrl = this.signaturePad.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `signature-${Date.now()}.png`;
    link.click();
  }

  private resizeCanvas(canvas: HTMLCanvasElement): void {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(ratio, ratio);
    }
  }
}
