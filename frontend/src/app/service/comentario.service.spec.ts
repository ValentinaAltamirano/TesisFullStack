import { TestBed } from '@angular/core/testing';

import { comentarioService } from './comentario.service';

describe('CommentServiceService', () => {
  let service: comentarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(comentarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
