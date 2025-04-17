import { AppMenuComponent } from '@/app/components/app-menu/app-menu.components'
import { Component } from '@angular/core'
import { IntroComponent } from './components/intro/intro.component'
import { OverviewComponent } from './components/overview/overview.component'
import { CurriculumComponent } from './components/curriculum/curriculum.component'
import { InstructorComponent } from './components/instructor/instructor.component'
import { ReviewsComponent } from './components/reviews/reviews.component'
import { FaqsComponent } from './components/faqs/faqs.component'
import { CommentComponent } from './components/comment/comment.component'
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component'
import { TopListedCourseComponent } from './components/top-listed-course/top-listed-course.component'
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap'
import { FooterComponent } from '@/app/components/footers/footer/footer.component'

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    AppMenuComponent,
    IntroComponent,
    OverviewComponent,
    CurriculumComponent,
    InstructorComponent,
    ReviewsComponent,
    FaqsComponent,
    CommentComponent,
    RightSidebarComponent,
    TopListedCourseComponent,
    NgbNavModule,
    FooterComponent,
  ],
  templateUrl: './detail.component.html',
  styles: ``,
})
export class DetailComponent {}
