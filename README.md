Now Updated
🏛️ Architecture Type Used:
Client-Server Architecture + Modular MVC (for Backend)


 Frontend (Client Layer – React App):
Built using React with TypeScript.

Follows component-based architecture (Reusable components, layouts, and pages).

After defining models in schema.prisma, I ran:


npx prisma migrate dev --name init


This created the tables in PostgreSQL and generated type-safe Prisma client.


ems-frontend/
├─ public/
│ ├─ index.html
│ ├─ manifest.json
│ └─ robots.txt
├─ src/
│ ├─ assets/
│ ├─ components/
│ │ ├─ ErrorBoundary.tsx
│ │ ├─ Header.tsx
│ │ └─ LogoutButton.tsx
│ ├─ layouts/
│ │ └─ MainLayout.tsx
│ ├─ pages/
│ │ ├─ Admin/
│ │ │ ├─ AdminDashboard.tsx
│ │ │ ├─ CreateUser.tsx
│ │ │ └─ SetBudget.tsx
│ │ ├─ Employee/
│ │ │ ├─ EmployeeDashboard.tsx
│ │ │ └─ SubmitExpense.tsx
│ │ ├─ Manager/
│ │ │ └─ ManagerDashboard.tsx
│ │ └─ Login.tsx
│ ├─ routes/
│ │ └─ AppRouter.tsx
│ ├─ services/
│ │ └─ api.ts
│ ├─ utils/
│ │ └─ auth.ts
│ ├─ App.tsx
│ ├─ index.css
│ └─ index.tsx
├─ .gitignore
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ README.md
├─ tailwind.config.js
└─ tsconfig.json

- **POST `/api/auth/login`** – Authenticates a user and returns a JSON Web Token (JWT) for subsequent requests. **Status:** Functional.

  - **Purpose:** Validate user credentials (e.g., email and password) and establish a session.
  - **Authentication Required:** No (public endpoint).
  - **Allowed Roles:** All users (Admin, Manager, Employee) use this to log in.
  - **Request Body Example:**
    ```json
    {
      "email": "user@example.com",
      "password": "yourPassword"
    }
    ```
  - **Expected Response:** On success, returns an auth token and user info. For example:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1Ni... (JWT token)",
      "user": {
        "id": 5,
        "name": "Jane Doe",
        "role": "Employee"
      },
      "expiresIn": 3600
    }
    ```
    On failure (invalid credentials), returns an error message (HTTP 401 Unauthorized).

- **POST `/api/auth/logout`** – Logs out the current user. **Status:** Functional.
  - **Purpose:** Invalidate the current user’s session/token (server will blacklist token or handle accordingly).
  - **Authentication Required:** Yes (must be logged in with a valid token).
  - **Allowed Roles:** Admin, Manager, Employee (any authenticated user).
  - **Request Body:** _None._ The token in the Authorization header is used to identify the session.
  - **Expected Response:** A success message confirming logout, e.g.:
    ```json
    { "message": "Logged out successfully." }
    ```
    After logout, the JWT is no longer valid for protected endpoints.

_(The application uses JWT-based auth. Include the token from `/api/auth/login` in the `Authorization: Bearer <token>` header for all protected endpoints.)_

## Expenses

- **GET `/api/expenses`** – Fetches a list of expense reports. **Status:** Functional.

  - **Purpose:** Retrieve expenses, with results tailored to the user’s role:
    - Employees see _only their own_ submitted expenses.
    - Managers see expenses submitted by their team/employees under their supervision.
    - Admins see _all_ expenses in the system.
  - **Authentication Required:** Yes (JWT token).
  - **Allowed Roles:** Employee, Manager, Admin (results filtered by role as above).
  - **Expected Response:** Returns an array of expense objects. Example (Manager or Admin viewing multiple records):
    ```json
    [
      {
        "id": 42,
        "employeeId": 5,
        "amount": 200.0,
        "description": "Team Dinner Expense",
        "category": "Travel",
        "status": "Pending",
        "submittedAt": "2025-04-01T12:34:56Z"
      },
      {
        "id": 43,
        "employeeId": 7,
        "amount": 150.5,
        "description": "Office Supplies",
        "category": "Supplies",
        "status": "Approved",
        "approvedBy": 2,
        "approvedAt": "2025-04-02T09:20:15Z",
        "submittedAt": "2025-04-01T09:10:00Z"
      }
    ]
    ```
    Each expense includes fields such as `id`, `employeeId` (who submitted), `amount`, `description`, `category`, current `status`, timestamps, and if approved, who approved it.

- **POST `/api/expenses`** – Submit a new expense report. **Status:** Functional.

  - **Purpose:** Allow an employee or manager to create a new expense entry for approval.
  - **Authentication Required:** Yes (JWT token).
  - **Allowed Roles:** Employee, Manager (typically used by employees to file expenses; managers can file their own expenses as well).
  - **Request Body Example:**
    ```json
    {
      "amount": 250.75,
      "description": "Client meeting lunch",
      "category": "Travel",
      "date": "2025-04-10",
      "remarks": "Lunch with client to discuss project"
    }
    ```
    _(Fields like `date` or `remarks` may vary based on implementation. The server associates the expense with the logged-in user.)_
  - **Expected Response:** Returns the created expense object with an assigned ID and default status. For example:
    ```json
    {
      "id": 101,
      "employeeId": 5,
      "amount": 250.75,
      "description": "Client meeting lunch",
      "category": "Travel",
      "status": "Pending",
      "submittedAt": "2025-04-10T10:15:30Z"
    }
    ```
    The initial status will be `Pending`, awaiting approval.

- **GET `/api/expenses/{id}`** – Fetch a specific expense by ID. **Status:** Functional.

  - **Purpose:** Retrieve detailed information for a single expense report.
  - **Authentication Required:** Yes (JWT token).
  - **Allowed Roles:** Employee (if they own the expense), Manager (if it’s in their team), Admin. Access is restricted to relevant users – e.g., an employee cannot view someone else’s expense.
  - **Expected Response:** Returns the expense object if permitted. Example:
    ```json
    {
      "id": 42,
      "employeeId": 5,
      "employeeName": "Jane Doe",
      "amount": 200.0,
      "description": "Team Dinner Expense",
      "category": "Travel",
      "status": "Pending",
      "submittedAt": "2025-04-01T12:34:56Z",
      "attachments": [],
      "comments": []
    }
    ```
    If the expense is not found or not accessible to the user, an error (404 or 403) is returned.

- **PUT `/api/expenses/{id}`** – Update an existing expense. **Status:** Functional.

  - **Purpose:** Allows editing an expense or approving it, depending on role and context. This endpoint serves two functions:
    - **Expense Edit:** An employee can edit details of their own expense _if it’s still pending and not yet approved_. For example, correcting the amount or description.
    - **Expense Approval/Rejection:** A Manager or Admin can update the status of the expense (e.g., change status from “Pending” to “Approved” or “Rejected”).
  - **Authentication Required:** Yes (JWT token).
  - **Allowed Roles:**
    - Employee (only to modify their own pending expenses – cannot change status to approve their own expense).
    - Manager (can change status of expenses of their team’s employees).
    - Admin (can modify any expense and change status).
  - **Request Body Example (Manager approving an expense):**
    ```json
    {
      "status": "Approved",
      "approvalComment": "Looks good, approved."
    }
    ```
    Or, **Request Body (Employee editing an expense):**
    ```json
    {
      "amount": 180.0,
      "description": "Team Dinner (updated amount)"
    }
    ```
    Only the fields provided will be updated. Managers/Admins primarily send a new `status` (and optionally a comment), whereas employees can update fields like `amount`, `description`, etc., but not the status.
  - **Expected Response:** Returns the updated expense object. For example, after approval:
    ```json
    {
      "id": 42,
      "employeeId": 5,
      "amount": 200.0,
      "description": "Team Dinner Expense",
      "category": "Travel",
      "status": "Approved",
      "approvedBy": 2,
      "approvedAt": "2025-04-10T11:00:00Z",
      "approvalComment": "Looks good, approved.",
      "submittedAt": "2025-04-01T12:34:56Z"
    }
    ```
    If the expense was edited by the submitter (not approved yet), the updated fields are reflected and status remains `Pending`. In all cases, role-based rules are enforced (e.g., employees cannot approve their own expense).

- **DELETE `/api/expenses/{id}`** – Delete an expense report. **Status:** Functional.
  - **Purpose:** Remove an expense entry. Typically used if an expense was entered in error or an admin needs to purge an entry.
  - **Authentication Required:** Yes (JWT token).
  - **Allowed Roles:** Admin can delete any expense; Managers can delete expenses of their team _if needed_ (optional based on policy); Employees can **only delete their own expense** and only if it’s still pending/unapproved.
  - **Expected Response:** A confirmation message upon successful deletion. For example:
    ```json
    { "message": "Expense 42 has been deleted." }
    ```
    If the expense cannot be deleted (e.g., not found or not authorized), an error message will be returned (404 Not Found or 403 Forbidden).

## Budgets

- **GET `/api/budgets`** – Retrieves budget allocations. **Status:** Functional.

  - **Purpose:** Provide information on budget limits and usage. The behavior differs by role:
    - Admins get a list of all budgets for all departments/teams or managers.
    - Managers get the budget allocated to _their department or team_, including how much has been spent vs. remaining.
    - Employees typically do not have direct access to budgets (this endpoint may return a 403 Forbidden for employees, or possibly a limited view if applicable).
  - **Authentication Required:** Yes (JWT token).
  - **Allowed Roles:** Admin, Manager. _(Employees are usually not allowed to call this, unless the system exposes a read-only view of their department budget.)_
  - **Expected Response:** For an Admin, an array of budget objects for each managed unit. Example (Admin view):
    ```json
    [
      {
        "id": 1,
        "department": "Engineering",
        "managerId": 2,
        "allocatedAmount": 50000.0,
        "spentAmount": 35000.0,
        "currency": "USD"
      },
      {
        "id": 2,
        "department": "Sales",
        "managerId": 3,
        "allocatedAmount": 30000.0,
        "spentAmount": 24000.0,
        "currency": "USD"
      }
    ]
    ```
    A Manager will see only their own department’s budget, for example:
    ```json
    {
      "id": 2,
      "department": "Sales",
      "managerId": 3,
      "allocatedAmount": 30000.0,
      "spentAmount": 24000.0,
      "currency": "USD"
    }
    ```
    In this example, the Sales manager (user ID 3) has a \$30k budget, with \$24k already spent (perhaps through approved expenses).

- **POST `/api/budgets`** – Create a new budget allocation. **Status:** Functional.

  - **Purpose:** Allows the Admin to set up a budget for a department or manager. This would typically be done at the start of a period (quarter/year) or when adding a new department/team.
  - **Authentication Required:** Yes (JWT token).
  - **Allowed Roles:** Admin only (managers/employees are not permitted to create budgets).
  - **Request Body Example:**
    ```json
    {
      "department": "Marketing",
      "managerId": 4,
      "allocatedAmount": 20000.0,
      "currency": "USD"
    }
    ```
    This would allocate a \$20k budget to the Marketing department under manager with ID 4.
  - **Expected Response:** The newly created budget object with a generated ID. For example:
    ```json
    {
      "id": 5,
      "department": "Marketing",
      "managerId": 4,
      "allocatedAmount": 20000.0,
      "spentAmount": 0.0,
      "currency": "USD",
      "createdAt": "2025-04-10T12:00:00Z"
    }
    ```
    If the manager or department already has a budget, the API might return an error to prevent duplicates.

- **PUT `/api/budgets/{id}`** – Update an existing budget. **Status:** Functional.

  - **Purpose:** Modify the allocation or details of a budget. For example, increase or decrease the allocated amount, or update which manager/department it applies to.
  - **Authentication Required:** Yes (JWT token).
  - **Allowed Roles:** Admin only. (Managers cannot directly change their budget allocation through the API.)
  - **Request Body Example:**
    ```json
    {
      "allocatedAmount": 22000.0
    }
    ```
    This would adjust the budget’s allocated amount to \$22,000 for the specified budget ID. You can also update other fields like `managerId` if reassigning a budget.
  - **Expected Response:** Returns the updated budget object. For example:
    ```json
    {
      "id": 5,
      "department": "Marketing",
      "managerId": 4,
      "allocatedAmount": 22000.0,
      "spentAmount": 5000.0,
      "currency": "USD",
      "updatedAt": "2025-05-01T09:30:00Z"
    }
    ```
    The `spentAmount` reflects current usage (which remains unchanged by this update unless expenses are re-calculated), and `allocatedAmount` is now increased. If the budget ID is not found, returns 404; if not authorized, 403.

- **DELETE `/api/budgets/{id}`** – Remove a budget entry. **Status:** Functional.
  - **Purpose:** Delete a budget allocation (perhaps if a department is removed or budgets are being restructured).
  - **Authentication Required:** Yes (JWT token).
  - **Allowed Roles:** Admin only.
  - **Expected Response:** A success message confirming deletion. For example:
    ```json
    { "message": "Budget 5 has been deleted." }
    ```
    If the budget is not found, a 404 error is returned. If a manager attempts this action, a 403 Forbidden is returned.

## Dashboard & Reporting

- **GET `/api/dashboard`** – Retrieves aggregated metrics and reports for the authenticated user’s scope. **Status:** Functional.

  - **Purpose:** Provide a quick overview of key statistics in the system, tailored to the user’s role. This is used to display dashboard summaries (e.g., on an admin or manager homepage).
  - **Authentication Required:** Yes (JWT token).
  - **Allowed Roles:** Admin, Manager, Employee (the content of the report varies by role).
  - **Behavior:**
    - **Admin:** Sees organization-wide metrics (e.g., total number of expenses, how many are pending vs approved, total amount spent, and overall budget utilization across all departments).
    - **Manager:** Sees metrics for their team/department (e.g., number of expenses submitted by their team, pending approvals, total team expenses, and remaining budget for their department).
    - **Employee:** Sees personal stats (e.g., how many expenses they submitted, how many approved/denied, total amount reimbursed to them).
  - **Expected Response:** A JSON object containing summary statistics. For example, an **Admin** might receive:
    ```json
    {
      "totalExpenses": 150,
      "pendingExpenses": 10,
      "approvedExpenses": 140,
      "totalExpenseAmount": 75250.0,
      "totalBudgets": 5,
      "overallBudgetAllocated": 150000.0,
      "overallBudgetUsed": 75250.0,
      "budgetUtilization": 0.5
    }
    ```
    A **Manager** might receive a subset focused on their department, e.g.:
    ```json
    {
      "teamExpenses": 40,
      "pendingExpenses": 3,
      "approvedExpenses": 37,
      "teamExpenseAmount": 12500.0,
      "teamBudgetAllocated": 30000.0,
      "teamBudgetUsed": 12500.0,
      "budgetUtilization": 0.4167
    }
    ```
    An **Employee** might see something like:
    ```json
    {
      "mySubmittedExpenses": 8,
      "myApprovedExpenses": 6,
      "myPendingExpenses": 2,
      "myExpenseTotal": 1800.0
    }
    ```
    _(Exact fields may vary, but the idea is that the response includes counts and sums relevant to the user.)_ If the user is not authorized (not logged in), the request will be rejected with 401 Unauthorized.

- **GET `/api/reports/expenses`** – (Optional) Generate detailed expense reports. **Status:** Functional.
  - **Purpose:** Provide a more detailed breakdown of expenses, possibly filtered by query parameters (such as date ranges or categories). This can be used to power reporting features or downloads (CSV/PDF reports, etc.).
  - **Authentication Required:** Yes (JWT token).
  - **Allowed Roles:** Admin, Manager. (Employees typically don’t have access to system-wide reports, though they can view their own via other endpoints.)
  - **Request:** This endpoint may accept query parameters for filtering (e.g., `?from=2025-01-01&to=2025-03-31` to filter by date, or `?department=Sales` if admin is filtering by department). For example:
    ```
    GET /api/reports/expenses?from=2025-01-01&to=2025-03-31
    ```
  - **Expected Response:** Returns aggregated data or a list of expense entries matching criteria. For instance, a report summary:
    ```json
    {
      "from": "2025-01-01",
      "to": "2025-03-31",
      "totalExpenses": 50,
      "totalAmount": 18350.0,
      "byCategory": {
        "Travel": 9500.0,
        "Supplies": 4850.0,
        "Training": 3000.0
      },
      "byEmployee": [
        { "employeeId": 5, "name": "Jane Doe", "amount": 5000.0 },
        { "employeeId": 7, "name": "John Smith", "amount": 4200.0 }
        // ... more entries
      ]
    }
    ```
    This example shows a summary for Q1 2025, including total expense count and amount, breakdown by category, and top spenders by employee. If detailed listing is requested instead (e.g., no aggregation), the endpoint might return a list of expense records similar to GET `/api/expenses` but filtered.

---

**Note:** All endpoints use standard HTTP response codes to indicate success or failure (e.g., 200 OK for success, 400/404 for client errors, 500 for server errors). Role-based access is enforced on the server side – if a user without the proper role or authorization attempts to access a protected endpoint, the API will respond with **403 Forbidden** or **401 Unauthorized** as appropriate. Ensure to include the JWT token in your request headers for all protected routes (`Authorization: Bearer <token>`). The above endpoints have been tested and are confirmed to be working as expected in the current build of the Expense Management System.

![alt text](image.png)