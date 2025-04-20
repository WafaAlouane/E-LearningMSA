import { currency } from '@/app/common/constants'
import { Component } from '@angular/core'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { LightgalleryModule } from 'lightgallery/angular'
import lgVideo from 'lightgallery/plugins/video'

@Component({
  selector: 'detail-right-sidebar',
  standalone: true,
  imports: [LightgalleryModule, NgbDropdownModule],
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss',
})
export class RightSidebarComponent {
  currency = currency
  settings = {
    counter: false,
    plugins: [lgVideo],
    selector: 'a',
    download: false,
  }
}
