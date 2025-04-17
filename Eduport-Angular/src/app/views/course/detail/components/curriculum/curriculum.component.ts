import { Component } from '@angular/core'
import { CurriculumList } from '../../data'
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'detail-curriculum',
  standalone: true,
  imports: [NgbAccordionModule],
  templateUrl: './curriculum.component.html',
  styles: ``,
})
export class CurriculumComponent {
  curriculumList = CurriculumList
}
