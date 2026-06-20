package com.ems.service;

import com.ems.dto.LeaveProcessRequest;
import com.ems.entity.*;
import com.ems.model.*;
import com.ems.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class EmsService {
    private final EmployeeRepository employees;
    private final DepartmentRepository departments;
    private final AttendanceRepository attendance;
    private final LeaveRequestRepository leaves;
    private final PayrollRepository payroll;
    private final RecentActivityRepository activities;

    public EmsService(EmployeeRepository employees, DepartmentRepository departments,
                      AttendanceRepository attendance, LeaveRequestRepository leaves,
                      PayrollRepository payroll, RecentActivityRepository activities) {
        this.employees = employees;
        this.departments = departments;
        this.attendance = attendance;
        this.leaves = leaves;
        this.payroll = payroll;
        this.activities = activities;
    }

    @PostConstruct
    @Transactional
    void seedIfEmpty() {
        if (departments.count() > 0) {
            return;
        }

        DepartmentEntity engineering = saveDepartment("Engineering", "ENG", "Core software engineering and systems design", "Sarah Jenkins");
        DepartmentEntity hr = saveDepartment("Human Resources", "HRD", "Talent management, recruitment, and employee relations", "David Mercer");
        DepartmentEntity sales = saveDepartment("Sales & Marketing", "S&M", "Enterprise sales executive team and marketing strategies", "Amanda Collins");
        DepartmentEntity finance = saveDepartment("Finance & Accounts", "FIN", "Payroll management, corporate finance, and accounting", "Robert Vance");
        DepartmentEntity product = saveDepartment("Product Management", "PRD", "Product design, specifications, and client delivery", "Diana Prince");

        EmployeeEntity sarah = saveEmployee("EMP-001", "Sarah", "Jenkins", "sarah.j@enterprise.com", "+1 (555) 019-2834", engineering, "VP of Engineering", UserRole.ADMIN, 135000, "2022-01-15", EmployeeStatus.Active, Gender.Female, "1987-03-22", "422 Pine Ave, Seattle, WA");
        EmployeeEntity alex = saveEmployee("EMP-002", "Alex", "Rodriguez", "alex.r@enterprise.com", "+1 (555) 018-9921", engineering, "Senior Developer", UserRole.MANAGER, 95000, "2023-04-10", EmployeeStatus.Active, Gender.Male, "1991-08-14", "711 Elm Road, Redmond, WA");
        EmployeeEntity emma = saveEmployee("EMP-003", "Emma", "Watson", "emma.w@enterprise.com", "+1 (555) 021-4822", engineering, "Frontend Engineer", UserRole.EMPLOYEE, 78000, "2024-02-01", EmployeeStatus.Active, Gender.Female, "1995-11-30", "89 Main St, Bellevue, WA");
        EmployeeEntity david = saveEmployee("EMP-004", "David", "Mercer", "david.m@enterprise.com", "+1 (555) 017-3841", hr, "HR Director", UserRole.MANAGER, 82000, "2021-06-20", EmployeeStatus.Active, Gender.Male, "1984-05-09", "155 Oak Boulevard, Seattle, WA");
        EmployeeEntity clara = saveEmployee("EMP-005", "Clara", "Oswald", "clara.o@enterprise.com", "+1 (555) 022-5591", hr, "HR Coordinator", UserRole.EMPLOYEE, 54000, "2023-09-12", EmployeeStatus.Active, Gender.Female, "1997-02-18", "47 Maple Ln, Seattle, WA");
        EmployeeEntity amanda = saveEmployee("EMP-006", "Amanda", "Collins", "amanda.c@enterprise.com", "+1 (555) 015-2831", sales, "Sales Director", UserRole.MANAGER, 90000, "2022-11-01", EmployeeStatus.Active, Gender.Female, "1989-10-05", "29 Sea Breeze Ave, Tacoma, WA");
        EmployeeEntity marcus = saveEmployee("EMP-007", "Marcus", "Aurelius", "marcus.a@enterprise.com", "+1 (555) 024-4411", sales, "Senior Account Executive", UserRole.EMPLOYEE, 72000, "2023-02-15", EmployeeStatus.OnLeave, Gender.Male, "1985-04-26", "188 Forum Way, Lynnwood, WA");
        EmployeeEntity diana = saveEmployee("EMP-008", "Diana", "Prince", "diana.p@enterprise.com", "+1 (555) 013-1122", product, "Product Lead", UserRole.MANAGER, 110000, "2022-08-10", EmployeeStatus.Active, Gender.Female, "1988-01-20", "99 Themis Cove, Seattle, WA");
        EmployeeEntity robert = saveEmployee("EMP-009", "Robert", "Vance", "robert.v@enterprise.com", "+1 (555) 011-9231", finance, "Chief Treasurer", UserRole.MANAGER, 115000, "2020-03-01", EmployeeStatus.Active, Gender.Male, "1979-07-16", "88 Refrigeration Dr, Scranton, PA");
        EmployeeEntity john = saveEmployee("EMP-010", "John", "Doe", "john.doe@enterprise.com", "+1 (555) 039-4822", engineering, "Junior Developer", UserRole.EMPLOYEE, 58000, "2025-01-10", EmployeeStatus.Active, Gender.Male, "1999-12-05", "500 Cascade Ave, Seattle, WA");

        updateDepartmentCount(engineering.id);
        updateDepartmentCount(hr.id);
        updateDepartmentCount(sales.id);
        updateDepartmentCount(finance.id);
        updateDepartmentCount(product.id);

        for (EmployeeEntity employee : List.of(sarah, alex, emma, david, clara, amanda, marcus, diana, robert, john)) {
            for (String date : List.of("2026-06-01", "2026-06-02", "2026-06-03", "2026-06-04")) {
                AttendanceEntity record = new AttendanceEntity();
                record.employeeId = employee.id;
                record.employeeName = fullName(employee);
                record.date = LocalDate.parse(date);
                if ("On Leave".equals(employee.status)) {
                    record.status = "Absent";
                    record.workHours = BigDecimal.ZERO;
                } else {
                    record.checkIn = LocalTime.parse("09:00");
                    record.checkOut = LocalTime.parse("17:30");
                    record.status = "Present";
                    record.workHours = BigDecimal.valueOf(8.5);
                }
                attendance.save(record);
            }
        }

        saveLeave(marcus, LeaveType.Annual, "2026-06-01", "2026-06-08", 6, "Philosophy meditation and spiritual recharge", LeaveStatus.Approved, "2026-05-20", amanda.id, "Approved. Enjoy the wellness break");
        saveLeave(emma, LeaveType.Sick, "2026-06-05", "2026-06-06", 2, "Dental appointment and recovery wisdom tooth removal", LeaveStatus.Pending, "2026-06-03", null, null);
        saveLeave(clara, LeaveType.Casual, "2026-06-12", "2026-06-14", 2, "Family gathering event out of state", LeaveStatus.Pending, "2026-06-01", null, null);
        saveLeave(john, LeaveType.Unpaid, "2026-05-10", "2026-05-12", 3, "Moving to a new apartment downtown", LeaveStatus.Rejected, "2026-05-05", sarah.id, "Denied due to scheduled high deployment sprints. Moved to next month instead.");

        savePayroll(sarah, "May", 2026, 11250, 1200, 650, 11800, PayrollStatus.Paid, "2026-05-28");
        savePayroll(alex, "May", 2026, 7916, 500, 416, 8000, PayrollStatus.Paid, "2026-05-28");
        savePayroll(emma, "May", 2026, 6500, 400, 350, 6550, PayrollStatus.Paid, "2026-05-28");
        savePayroll(david, "May", 2026, 6833, 400, 350, 6883, PayrollStatus.Paid, "2026-05-28");
        savePayroll(clara, "May", 2026, 4500, 250, 220, 4530, PayrollStatus.Processing, null);
        savePayroll(amanda, "May", 2026, 7500, 800, 450, 7850, PayrollStatus.Paid, "2026-05-28");
        savePayroll(marcus, "May", 2026, 6000, 500, 350, 6150, PayrollStatus.Unpaid, null);

        log(ActivityType.leave, "Leave Applied", "Emma Watson applied for Sick Leave (2 days)", "Emma Watson", "1 hour ago");
        log(ActivityType.employee, "New Onboarding", "John Doe was onboarded to the Engineering division", "Admin Jenkins", "Yesterday");
        log(ActivityType.leave, "Leave Approved", "Marcus Aurelius leave request was approved by Sarah Jenkins", "Sarah Jenkins", "2 days ago");
        log(ActivityType.payroll, "May Salaries Disbursed", "Salary disbursements marked complete for 5 administrative users", "Robert Vance", "5 days ago");
        log(ActivityType.attendance, "Overtime Notification", "Alex Rodriguez recorded over 10 working hours", "System Agent", "2026-06-03");
    }

    public List<Employee> getEmployees() {
        return employees.findAllByOrderByEmployeeCodeAsc().stream().map(this::toModel).toList();
    }

    public Employee getEmployee(String id) {
        return toModel(getEmployeeEntity(id));
    }

    @Transactional
    public Employee createEmployee(Employee employee) {
        DepartmentEntity department = getDepartmentEntity(employee.departmentId);
        EmployeeEntity entity = new EmployeeEntity();
        entity.employeeCode = "EMP-%03d".formatted(employees.count() + 1);
        copyEmployee(employee, entity, department);
        EmployeeEntity saved = employees.save(entity);
        updateDepartmentCount(department.id);
        log(ActivityType.employee, "Employee Hired", "Successfully onboarded " + fullName(saved) + " as " + saved.designation, "Admin");
        return toModel(saved);
    }

    @Transactional
    public Employee updateEmployee(String id, Employee employee) {
        EmployeeEntity entity = getEmployeeEntity(id);
        UUID previousDepartment = entity.departmentId;
        DepartmentEntity department = getDepartmentEntity(employee.departmentId);
        copyEmployee(employee, entity, department);
        EmployeeEntity saved = employees.save(entity);
        updateDepartmentCount(previousDepartment);
        updateDepartmentCount(department.id);
        log(ActivityType.employee, "Employee Updated", "Updated core credentials of " + fullName(saved), "Admin");
        return toModel(saved);
    }

    @Transactional
    public void deleteEmployee(String id) {
        EmployeeEntity entity = getEmployeeEntity(id);
        employees.delete(entity);
        updateDepartmentCount(entity.departmentId);
        log(ActivityType.employee, "Employee Terminated", "Terminated corporate access key for " + fullName(entity), "Admin");
    }

    public List<Department> getDepartments() {
        return departments.findAllByOrderByNameAsc().stream().map(this::toModel).toList();
    }

    public Department createDepartment(Department department) {
        DepartmentEntity entity = new DepartmentEntity();
        entity.name = department.name;
        entity.code = department.code;
        entity.description = department.description;
        entity.managerName = department.managerName;
        DepartmentEntity saved = departments.save(entity);
        log(ActivityType.employee, "Department Created", "Set up new division: " + saved.name + " (" + saved.code + ")", "Admin");
        return toModel(saved);
    }

    @Transactional
    public Department updateDepartment(String id, Department department) {
        DepartmentEntity entity = getDepartmentEntity(id);
        entity.name = department.name;
        entity.code = department.code;
        entity.description = department.description;
        entity.managerName = department.managerName;
        DepartmentEntity saved = departments.save(entity);
        employees.findAll().stream()
                .filter(employee -> entity.id.equals(employee.departmentId))
                .forEach(employee -> {
                    employee.departmentName = saved.name;
                    employees.save(employee);
                });
        log(ActivityType.employee, "Department Edited", "Updated specifications for division " + saved.name, "Admin");
        return toModel(saved);
    }

    public void deleteDepartment(String id) {
        DepartmentEntity entity = getDepartmentEntity(id);
        if (entity.employeeCount > 0) {
            throw new ApiException(HttpStatus.CONFLICT, "Cannot delete: " + entity.name + " has active assigned employees.");
        }
        departments.delete(entity);
        log(ActivityType.employee, "Department Disbanded", "Disbanded vacant division " + entity.name, "Admin");
    }

    public List<Attendance> getAttendance() {
        return attendance.findAllByOrderByDateDescEmployeeNameAsc().stream().map(this::toModel).toList();
    }

    @Transactional
    public Attendance clockIn(String employeeId) {
        EmployeeEntity employee = getEmployeeEntity(employeeId);
        LocalDate today = LocalDate.now();
        LocalTime clockTime = LocalTime.now();
        AttendanceEntity record = attendance.findByEmployeeIdAndDate(employee.id, today).orElseGet(() -> {
            AttendanceEntity created = new AttendanceEntity();
            created.employeeId = employee.id;
            created.employeeName = fullName(employee);
            created.date = today;
            return created;
        });
        record.checkIn = clockTime;
        record.status = clockTime.isAfter(LocalTime.parse("09:15")) ? "Late" : "Present";
        AttendanceEntity saved = attendance.save(record);
        log(ActivityType.attendance, "Clock In Recorded", employee.firstName + " logged attendance check-in at " + time(clockTime), fullName(employee));
        return toModel(saved);
    }

    @Transactional
    public Attendance clockOut(String employeeId) {
        EmployeeEntity employee = getEmployeeEntity(employeeId);
        LocalDate today = LocalDate.now();
        AttendanceEntity record = attendance.findByEmployeeIdAndDate(employee.id, today)
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Employee must clock in before clocking out"));
        if (record.checkIn == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Employee must clock in before clocking out");
        }
        LocalTime clockTime = LocalTime.now();
        record.checkOut = clockTime;
        record.workHours = BigDecimal.valueOf(Math.max(0, Duration.between(record.checkIn, clockTime).toMinutes() / 60.0));
        AttendanceEntity saved = attendance.save(record);
        log(ActivityType.attendance, "Clock Out Recorded", record.employeeName + " completed work cycle. Logged check-out at " + time(clockTime), record.employeeName);
        return toModel(saved);
    }

    public List<LeaveRequest> getLeaves() {
        return leaves.findAllByOrderByAppliedDateDesc().stream().map(this::toModel).toList();
    }

    public LeaveRequest applyLeave(LeaveRequest request) {
        EmployeeEntity employee = getEmployeeEntity(request.employeeId);
        LeaveRequestEntity saved = saveLeave(employee, request.leaveType, request.startDate, request.endDate,
                request.durationDays, request.reason, LeaveStatus.Pending, LocalDate.now().toString(), null, null);
        log(ActivityType.leave, "Leave Application Raised", saved.employeeName + " submitted a " + saved.leaveType + " leave request", saved.employeeName);
        return toModel(saved);
    }

    @Transactional
    public LeaveRequest processLeave(String id, LeaveProcessRequest request) {
        LeaveRequestEntity entity = getLeaveEntity(id);
        entity.status = request.status.name();
        entity.remarks = request.remarks;
        LeaveRequestEntity saved = leaves.save(entity);
        if (request.status == LeaveStatus.Approved) {
            EmployeeEntity employee = getEmployeeEntity(saved.employeeId.toString());
            employee.status = employeeStatusLabel(EmployeeStatus.OnLeave);
            employees.save(employee);
        }
        log(ActivityType.leave, "Leave " + request.status, "Leave request from " + saved.employeeName + " was " + request.status.name().toLowerCase(), request.managerName == null ? "HR Admin" : request.managerName);
        return toModel(saved);
    }

    public List<Payroll> getPayroll() {
        return payroll.findAllByOrderByYearDescMonthAscEmployeeNameAsc().stream().map(this::toModel).toList();
    }

    public Payroll createPayroll(Payroll record) {
        EmployeeEntity employee = getEmployeeEntity(record.employeeId);
        PayrollEntity saved = savePayroll(employee, record.month, record.year, record.baseSalary, record.allowances,
                record.deductions, record.netSalary, record.status, record.paymentDate);
        log(ActivityType.payroll, "Payroll Record Formed", "Salary computed for " + saved.employeeName + " (" + saved.month + ")", "Finance Treasury");
        return toModel(saved);
    }

    public Payroll updatePayrollStatus(String id, PayrollStatus status) {
        PayrollEntity entity = getPayrollEntity(id);
        entity.status = status.name();
        entity.paymentDate = status == PayrollStatus.Paid ? LocalDate.now() : null;
        PayrollEntity saved = payroll.save(entity);
        log(ActivityType.payroll, "Salary Disbursed", "Salary status for " + saved.employeeName + " updated to " + status, "Finance Desk");
        return toModel(saved);
    }

    public List<RecentActivity> getActivities() {
        return activities.findTop50ByOrderByCreatedAtDesc().stream().map(this::toModel).toList();
    }

    private DepartmentEntity saveDepartment(String name, String code, String description, String managerName) {
        DepartmentEntity entity = new DepartmentEntity();
        entity.name = name;
        entity.code = code;
        entity.description = description;
        entity.managerName = managerName;
        return departments.save(entity);
    }

    private EmployeeEntity saveEmployee(String employeeCode, String firstName, String lastName, String email, String phone,
                                        DepartmentEntity department, String designation, UserRole role, double salary,
                                        String joinDate, EmployeeStatus status, Gender gender, String dob, String address) {
        EmployeeEntity entity = new EmployeeEntity();
        entity.employeeCode = employeeCode;
        entity.firstName = firstName;
        entity.lastName = lastName;
        entity.email = email;
        entity.phone = phone;
        entity.departmentId = department.id;
        entity.departmentName = department.name;
        entity.designation = designation;
        entity.role = role.name();
        entity.salary = BigDecimal.valueOf(salary);
        entity.joinDate = LocalDate.parse(joinDate);
        entity.status = employeeStatusLabel(status);
        entity.gender = gender == null ? null : gender.name();
        entity.dob = LocalDate.parse(dob);
        entity.address = address;
        return employees.save(entity);
    }

    private LeaveRequestEntity saveLeave(EmployeeEntity employee, LeaveType type, String startDate, String endDate,
                                         int durationDays, String reason, LeaveStatus status, String appliedDate,
                                         UUID approvedBy, String remarks) {
        LeaveRequestEntity entity = new LeaveRequestEntity();
        entity.employeeId = employee.id;
        entity.employeeName = fullName(employee);
        entity.departmentName = employee.departmentName;
        entity.leaveType = type.name();
        entity.startDate = LocalDate.parse(startDate);
        entity.endDate = LocalDate.parse(endDate);
        entity.durationDays = durationDays;
        entity.reason = reason;
        entity.status = status.name();
        entity.appliedDate = LocalDate.parse(appliedDate);
        entity.approvedBy = approvedBy;
        entity.remarks = remarks;
        return leaves.save(entity);
    }

    private PayrollEntity savePayroll(EmployeeEntity employee, String month, int year, double baseSalary, double allowances,
                                      double deductions, double netSalary, PayrollStatus status, String paymentDate) {
        PayrollEntity entity = new PayrollEntity();
        entity.employeeId = employee.id;
        entity.employeeName = fullName(employee);
        entity.departmentName = employee.departmentName;
        entity.designation = employee.designation;
        entity.month = month;
        entity.year = year;
        entity.baseSalary = BigDecimal.valueOf(baseSalary);
        entity.allowances = BigDecimal.valueOf(allowances);
        entity.deductions = BigDecimal.valueOf(deductions);
        entity.netSalary = BigDecimal.valueOf(netSalary);
        entity.status = status.name();
        entity.paymentDate = paymentDate == null ? null : LocalDate.parse(paymentDate);
        return payroll.save(entity);
    }

    private void copyEmployee(Employee source, EmployeeEntity target, DepartmentEntity department) {
        target.firstName = source.firstName;
        target.lastName = source.lastName;
        target.email = source.email;
        target.phone = source.phone;
        target.departmentId = department.id;
        target.departmentName = department.name;
        target.designation = source.designation;
        target.role = source.role.name();
        target.salary = BigDecimal.valueOf(source.salary);
        target.joinDate = LocalDate.parse(source.joinDate);
        target.status = employeeStatusLabel(source.status);
        target.gender = source.gender == null ? null : source.gender.name();
        target.dob = LocalDate.parse(source.dob);
        target.address = source.address;
    }

    private EmployeeEntity getEmployeeEntity(String id) {
        return employees.findById(UUID.fromString(id)).orElseThrow(() -> notFound("Employee not found"));
    }

    private DepartmentEntity getDepartmentEntity(String id) {
        return departments.findById(UUID.fromString(id)).orElseThrow(() -> notFound("Department not found"));
    }

    private LeaveRequestEntity getLeaveEntity(String id) {
        return leaves.findById(UUID.fromString(id)).orElseThrow(() -> notFound("Leave record not found"));
    }

    private PayrollEntity getPayrollEntity(String id) {
        return payroll.findById(UUID.fromString(id)).orElseThrow(() -> notFound("Payroll record not found"));
    }

    private void updateDepartmentCount(UUID departmentId) {
        departments.findById(departmentId).ifPresent(department -> {
            department.employeeCount = (int) employees.countByDepartmentId(departmentId);
            departments.save(department);
        });
    }

    private void log(ActivityType type, String title, String description, String user) {
        log(type, title, description, user, "Just now");
    }

    private void log(ActivityType type, String title, String description, String user, String timestampLabel) {
        RecentActivityEntity activity = new RecentActivityEntity();
        activity.type = type.name();
        activity.title = title;
        activity.description = description;
        activity.timestampLabel = timestampLabel;
        activity.user = user;
        activities.save(activity);
    }

    private Employee toModel(EmployeeEntity entity) {
        return new Employee(entity.id.toString(), entity.firstName, entity.lastName, entity.email, entity.phone,
                entity.departmentId.toString(), entity.departmentName, entity.designation, UserRole.valueOf(entity.role),
                entity.salary.doubleValue(), date(entity.joinDate), employeeStatus(entity.status), gender(entity.gender),
                date(entity.dob), entity.address);
    }

    private Department toModel(DepartmentEntity entity) {
        return new Department(entity.id.toString(), entity.name, entity.code, entity.description,
                entity.managerId == null ? null : entity.managerId.toString(), entity.managerName, entity.employeeCount);
    }

    private Attendance toModel(AttendanceEntity entity) {
        return new Attendance(entity.id.toString(), entity.employeeId.toString(), entity.employeeName, date(entity.date),
                time(entity.checkIn), time(entity.checkOut), attendanceStatus(entity.status),
                entity.workHours == null ? null : entity.workHours.doubleValue());
    }

    private LeaveRequest toModel(LeaveRequestEntity entity) {
        return new LeaveRequest(entity.id.toString(), entity.employeeId.toString(), entity.employeeName,
                entity.departmentName, LeaveType.valueOf(entity.leaveType), date(entity.startDate), date(entity.endDate),
                entity.durationDays, entity.reason, LeaveStatus.valueOf(entity.status), date(entity.appliedDate),
                entity.approvedBy == null ? null : entity.approvedBy.toString(), entity.remarks);
    }

    private Payroll toModel(PayrollEntity entity) {
        return new Payroll(entity.id.toString(), entity.employeeId.toString(), entity.employeeName, entity.departmentName,
                entity.designation, entity.month, entity.year, entity.baseSalary.doubleValue(),
                entity.allowances.doubleValue(), entity.deductions.doubleValue(), entity.netSalary.doubleValue(),
                PayrollStatus.valueOf(entity.status), date(entity.paymentDate));
    }

    private RecentActivity toModel(RecentActivityEntity entity) {
        return new RecentActivity(entity.id.toString(), ActivityType.valueOf(entity.type), entity.title,
                entity.description, entity.timestampLabel, entity.user);
    }

    private String date(LocalDate date) {
        return date == null ? null : date.toString();
    }

    private String time(LocalTime time) {
        return time == null ? null : time.format(DateTimeFormatter.ofPattern("HH:mm"));
    }

    private Gender gender(String value) {
        return value == null ? null : Gender.valueOf(value);
    }

    private EmployeeStatus employeeStatus(String value) {
        return "On Leave".equals(value) ? EmployeeStatus.OnLeave : EmployeeStatus.valueOf(value);
    }

    private AttendanceStatus attendanceStatus(String value) {
        return "Half-Day".equals(value) ? AttendanceStatus.HalfDay : AttendanceStatus.valueOf(value);
    }

    private String employeeStatusLabel(EmployeeStatus status) {
        return status == EmployeeStatus.OnLeave ? "On Leave" : status.name();
    }

    private String fullName(EmployeeEntity employee) {
        return employee.firstName + " " + employee.lastName;
    }

    private ApiException notFound(String message) {
        return new ApiException(HttpStatus.NOT_FOUND, message);
    }
}
