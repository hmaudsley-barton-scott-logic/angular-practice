import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from './header';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            params: { subscribe: jest.fn() },
            snapshot: {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Check for the actual header title text
    expect(compiled.textContent).toContain('Task Master');
  });

  it('should match snapshot', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
