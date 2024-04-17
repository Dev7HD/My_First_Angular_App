import {Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnInit} from '@angular/core';
import {bootstrapApplication} from "@angular/platform-browser";

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.css'
})
export class EditModalComponent implements OnInit {
  @ViewChild('editModal') myModal!: ElementRef;
  @Input() show = false; // Modal visibility state (passed from parent)
  @Output() close = new EventEmitter<void>(); // Event emitted on close
  @Output() modal: any;

  ngOnInit(): void {
    /*// Initialize the modal when the component initializes
    const modalElement = this.myModal.nativeElement;
    const myModal = new bootstrap.Modal(modalElement, {
      keyboard: false
    });*/
  }
  onClose() {
    this.close.emit(); // Emit close event
  }
}
