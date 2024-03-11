import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable()
export class DialogService {
  showDialog(options: SweetAlertOptions) {
    options.allowOutsideClick = false;
    return Swal.fire(options);
  }

  copyUrlToClipboard(url: string) {
    Swal.fire({
      title: 'Copy co-op room URL to clipboard',
      input: 'text',
      inputValue: url,
      showCancelButton: true,
      confirmButtonText: 'Copy',
      preConfirm: () => {
        return new Promise<void>((resolve) => {
          navigator.clipboard
            .writeText(url)
            .then(() => {
              Swal.fire('Copied!', '', 'success');
              resolve();
            })
            .catch((err) => {
              Swal.showValidationMessage(`Failed to copy: ${err}`);
            });
        });
      },
    });
  }
}
