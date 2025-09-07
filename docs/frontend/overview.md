# Frontend Overview

The Angular frontend is a modern, responsive single-page application (SPA) that provides a rich user interface for the FastAPI backend. It's built with the latest Angular features and best practices.

## Technology Stack

-   **Angular 20+** - Modern TypeScript-based framework
-   **TypeScript** - Type-safe JavaScript development
-   **Tailwind CSS** - Utility-first CSS framework
-   **Angular Material** - UI component library
-   **RxJS** - Reactive programming with observables
-   **Angular CLI** - Development and build tooling

## Project Structure

```
web-angular/
├── src/
│   ├── app/
│   │   ├── api-generated/     # Auto-generated API client
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # Business logic services
│   │   ├── guards/           # Route guards
│   │   ├── interceptors/     # HTTP interceptors
│   │   ├── models/           # TypeScript interfaces
│   │   ├── shared/           # Shared utilities
│   │   └── app.component.ts  # Root component
│   ├── assets/               # Static assets
│   ├── environments/         # Environment configurations
│   └── styles/               # Global styles
├── dist/                     # Development build output
├── angular.json              # Angular CLI configuration
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts

# Root level (for production)
../publish/                   # Production build output
└── browser/                  # Angular build files for FastAPI
```

## Key Features

### 1. Automated API Client Generation

The frontend automatically generates TypeScript interfaces and HTTP client methods from the backend's OpenAPI specification:

```bash
# Generate API client
npm run generate:api
```

### 2. Production Build System

The Angular application includes optimized build scripts for different environments:

```bash
# Development build (outputs to dist/)
npm run build

# Production build (outputs to ../publish/browser/)
npm run build:prod

# Development server with hot reload
npm start
```

**Production Build Features:**

-   Outputs to `../publish/browser/` for integration with FastAPI
-   Optimized bundle sizes with tree-shaking
-   Minified and compressed assets
-   Cache-friendly file naming with hashes

This creates type-safe API clients in `src/app/api-generated/`:

```typescript
// Auto-generated service
export class UsersService {
    constructor(private http: HttpClient) {}

    getUsers(params?: GetUsersParams): Observable<User[]> {
        return this.http.get<User[]>("/api/users", { params });
    }

    createUser(user: CreateUserRequest): Observable<User> {
        return this.http.post<User>("/api/users", user);
    }
}
```

### 3. Reactive State Management

Uses RxJS for reactive state management:

```typescript
@Injectable()
export class UserService {
    private usersSubject = new BehaviorSubject<User[]>([]);
    public users$ = this.usersSubject.asObservable();

    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    loadUsers(): void {
        this.loadingSubject.next(true);
        this.apiService.getUsers().subscribe({
            next: (users) => {
                this.usersSubject.next(users);
                this.loadingSubject.next(false);
            },
            error: (error) => {
                console.error("Failed to load users:", error);
                this.loadingSubject.next(false);
            },
        });
    }
}
```

### 4. Authentication System

JWT-based authentication with automatic token management:

```typescript
@Injectable()
export class AuthService {
    private tokenKey = "auth_token";
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    login(email: string, password: string): Observable<LoginResponse> {
        return this.apiService.login({ email, password }).pipe(
            tap((response) => {
                localStorage.setItem(this.tokenKey, response.access_token);
                this.loadCurrentUser();
            })
        );
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        this.currentUserSubject.next(null);
        this.router.navigate(["/login"]);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem(this.tokenKey);
    }
}
```

### 5. Route Guards

Protect routes with authentication guards:

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean {
        if (this.authService.isAuthenticated()) {
            return true;
        }

        this.router.navigate(["/login"]);
        return false;
    }
}
```

### 6. HTTP Interceptors

Automatic token injection and error handling:

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem("auth_token");

        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    this.authService.logout();
                }
                return throwError(() => error);
            })
        );
    }
}
```

## Component Architecture

### Smart vs Presentational Components

The application follows the smart/presentational component pattern:

#### Smart Components (Containers)

```typescript
@Component({
    selector: "app-user-list-page",
    template: `
        <app-user-list
            [users]="users$ | async"
            [loading]="loading$ | async"
            (userSelected)="onUserSelected($event)"
            (createUser)="onCreateUser()"
        ></app-user-list>
    `,
})
export class UserListPageComponent {
    users$ = this.userService.users$;
    loading$ = this.userService.loading$;

    constructor(private userService: UserService) {}

    onUserSelected(user: User): void {
        this.router.navigate(["/users", user.id]);
    }

    onCreateUser(): void {
        // Handle user creation
    }
}
```

#### Presentational Components

```typescript
@Component({
    selector: "app-user-list",
    template: `
        <div class="user-list">
            <div *ngIf="loading" class="loading">Loading...</div>
            <div
                *ngFor="let user of users"
                class="user-card"
                (click)="userSelected.emit(user)"
            >
                {{ user.email }}
            </div>
            <button (click)="createUser.emit()" class="btn-primary">Add User</button>
        </div>
    `,
})
export class UserListComponent {
    @Input() users: User[] = [];
    @Input() loading = false;
    @Output() userSelected = new EventEmitter<User>();
    @Output() createUser = new EventEmitter<void>();
}
```

## Styling with Tailwind CSS

The application uses Tailwind CSS for styling:

```html
<!-- Responsive design with Tailwind -->
<div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Card Title</h3>
            <p class="text-gray-600">Card content goes here...</p>
            <button
                class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
                Action
            </button>
        </div>
    </div>
</div>
```

### Custom Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#eff6ff",
                    500: "#3b82f6",
                    900: "#1e3a8a",
                },
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
```

## Error Handling

### Global Error Handler

```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private notificationService: NotificationService) {}

    handleError(error: any): void {
        console.error("Global error:", error);

        if (error instanceof HttpErrorResponse) {
            this.handleHttpError(error);
        } else {
            this.notificationService.showError("An unexpected error occurred");
        }
    }

    private handleHttpError(error: HttpErrorResponse): void {
        switch (error.status) {
            case 400:
                this.notificationService.showError("Invalid request");
                break;
            case 401:
                this.notificationService.showError("Authentication required");
                break;
            case 403:
                this.notificationService.showError("Access denied");
                break;
            case 404:
                this.notificationService.showError("Resource not found");
                break;
            default:
                this.notificationService.showError("Server error occurred");
        }
    }
}
```

## Form Handling

### Reactive Forms

```typescript
@Component({
    selector: "app-user-form",
    template: `
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
                <label for="email">Email</label>
                <input
                    id="email"
                    type="email"
                    formControlName="email"
                    class="form-control"
                    [class.error]="emailControl.invalid && emailControl.touched"
                />
                <div
                    *ngIf="emailControl.invalid && emailControl.touched"
                    class="error-message"
                >
                    <span *ngIf="emailControl.errors?.['required']"
                        >Email is required</span
                    >
                    <span *ngIf="emailControl.errors?.['email']"
                        >Invalid email format</span
                    >
                </div>
            </div>

            <button type="submit" [disabled]="userForm.invalid" class="btn-primary">
                {{ isEditing ? "Update" : "Create" }} User
            </button>
        </form>
    `,
})
export class UserFormComponent {
    userForm = this.fb.group({
        email: ["", [Validators.required, Validators.email]],
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
    });

    get emailControl() {
        return this.userForm.get("email")!;
    }

    constructor(private fb: FormBuilder) {}

    onSubmit(): void {
        if (this.userForm.valid) {
            const userData = this.userForm.value;
            // Handle form submission
        }
    }
}
```

## Testing

### Unit Testing with Jasmine/Karma

```typescript
describe("UserService", () => {
    let service: UserService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UserService],
        });

        service = TestBed.inject(UserService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it("should load users", () => {
        const mockUsers: User[] = [
            { id: 1, email: "user1@example.com" },
            { id: 2, email: "user2@example.com" },
        ];

        service.loadUsers();

        const req = httpMock.expectOne("/api/users");
        expect(req.request.method).toBe("GET");
        req.flush(mockUsers);

        service.users$.subscribe((users) => {
            expect(users).toEqual(mockUsers);
        });
    });
});
```

### E2E Testing with Cypress

```typescript
// cypress/e2e/user-management.cy.ts
describe("User Management", () => {
    beforeEach(() => {
        cy.visit("/login");
        cy.login("admin@example.com", "password");
    });

    it("should display user list", () => {
        cy.visit("/users");
        cy.get("[data-cy=user-list]").should("be.visible");
        cy.get("[data-cy=user-item]").should("have.length.greaterThan", 0);
    });

    it("should create new user", () => {
        cy.visit("/users");
        cy.get("[data-cy=add-user-btn]").click();

        cy.get("[data-cy=email-input]").type("newuser@example.com");
        cy.get("[data-cy=submit-btn]").click();

        cy.get("[data-cy=success-message]").should("contain", "User created");
    });
});
```

## Performance Optimization

### Lazy Loading

```typescript
const routes: Routes = [
    {
        path: "users",
        loadChildren: () => import("./users/users.module").then((m) => m.UsersModule),
        canActivate: [AuthGuard],
    },
    {
        path: "admin",
        loadChildren: () => import("./admin/admin.module").then((m) => m.AdminModule),
        canActivate: [AuthGuard, AdminGuard],
    },
];
```

### OnPush Change Detection

```typescript
@Component({
    selector: "app-user-card",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="user-card">
            <h3>{{ user.name }}</h3>
            <p>{{ user.email }}</p>
        </div>
    `,
})
export class UserCardComponent {
    @Input() user!: User;

    constructor(private cdr: ChangeDetectorRef) {}
}
```

### Virtual Scrolling

```html
<cdk-virtual-scroll-viewport itemSize="50" class="viewport">
    <div *cdkVirtualFor="let user of users" class="user-item">
        {{ user.name }} - {{ user.email }}
    </div>
</cdk-virtual-scroll-viewport>
```

## Production Integration

### FastAPI Static File Serving

In production, the Angular application is served by FastAPI as static files:

```python
# FastAPI automatically serves Angular app
static_dir = Path(__file__).parent / "static"
index_file = static_dir / "index.html"

if index_file.exists():
    # Mount static files for Angular app
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

    # Serve Angular app at root path (catch-all for SPA routing)
    @app.get("/{full_path:path}")
    async def serve_angular_app(request: Request, full_path: str):
        # Handle Angular client-side routing
        return FileResponse(index_file)
```

### Build and Deployment Workflow

```bash
# Local development
npm start                    # Angular dev server on :4200
uv run -m rest_angular      # FastAPI on :8000

# Production build with Docker (port 8000 exposed by default)
npm run build:prod          # Builds to ../publish/browser/
docker compose up --build   # FastAPI serves both API and frontend on :8000
```

### Environment Configuration

The Angular app adapts to different environments:

```typescript
// src/environments/environment.ts
export const environment = {
    production: false,
    apiUrl: "http://localhost:8000/api",
    wsUrl: "ws://localhost:8000/ws",
};

// src/environments/environment.production.ts
export const environment = {
    production: true,
    apiUrl: "/api", // Relative URL when served by FastAPI
    wsUrl: "/ws",
};
```

## Next Steps

-   [Components Guide](components.md) - Learn about reusable components
-   [Services Guide](services.md) - Understand business logic services
-   [API Integration](api-integration.md) - Connect with the backend API
-   [Docker Deployment](../deployment/docker.md) - Deploy to production
