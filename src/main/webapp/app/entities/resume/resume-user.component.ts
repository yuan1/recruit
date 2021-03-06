import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ResumeService} from './resume.service';
import {Resume} from './resume.model';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Principal} from '../../shared';

@Component({
  selector: 'jhi-resume-user',
  templateUrl: './resume-user.component.html',
  styles: []
})
export class ResumeUserComponent implements OnInit {
    resume: Resume = new Resume();
    isSaving: boolean;

    constructor(
        private resumeService: ResumeService,
        private principal: Principal,
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.principal.identity().then((value) => {
            this.resume.userId = value.id;
            this.resumeService.findByUserId(value.id).subscribe((v) => {
                this.resume = v.body;
            });
        });
    }

    save() {
        this.isSaving = true;
        if (this.resume.id !== undefined) {
            this.subscribeToSaveResponse(
                this.resumeService.update(this.resume));
        } else {
            this.subscribeToSaveResponse(
                this.resumeService.create(this.resume));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Resume>>) {
        result.subscribe((res: HttpResponse<Resume>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Resume) {
        this.isSaving = false;
    }

    private onSaveError() {
        this.isSaving = false;
    }

}
