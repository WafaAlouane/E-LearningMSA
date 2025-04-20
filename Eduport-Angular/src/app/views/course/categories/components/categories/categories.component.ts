import { Component } from '@angular/core'
import { CategoryList } from '../../data'

@Component({
  selector: 'course-categories',
  standalone: true,
  imports: [],
  templateUrl: './categories.component.html',
  styles: ``,
})
export class CourseCategoriesComponent {
  categories = CategoryList
}
