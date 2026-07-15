$api = "https://healthsystem.runasp.net/api"
$headers = @{ "Content-Type" = "application/json" }

# ─────────────────────────────────────────────
# 1. REGISTER
# ─────────────────────────────────────────────
Write-Host "===== Registering Accounts =====" -ForegroundColor Cyan

$regHeaders = @{ "Content-Type" = "application/json"; "skipAuth" = "true" }

$patients = @(
    @{ firstName = "Ahmed"; middleName = "Hassan"; lastName = "Ali"; email = "patient1@test.com"; password = "Patient@123"; phone = "01000000001"; nationalID = "29801012345671"; gender = "Male"; dateOfBirth = "1998-01-01"; bloodGroup = "A+"; chronic = @(); previousSurgery = @(); allergies = @(); governorate = "Cairo"; address = "123 Main St"; hasInsurance = "true" },
    @{ firstName = "Sara"; middleName = "Mohamed"; lastName = "Hassan"; email = "patient2@test.com"; password = "Patient@123"; phone = "01000000002"; nationalID = "29503022345672"; gender = "Female"; dateOfBirth = "1995-03-02"; bloodGroup = "O+"; chronic = @("Asthma"); previousSurgery = @(); allergies = @("Penicillin"); governorate = "Alexandria"; address = "456 El Corniche"; hasInsurance = "false" },
    @{ firstName = "Omar"; middleName = "Ahmed"; lastName = "Ali"; email = "patient3@test.com"; password = "Patient@123"; phone = "01000000003"; nationalID = "29205152345673"; gender = "Male"; dateOfBirth = "1992-05-15"; bloodGroup = "B+"; chronic = @("Diabetes"); previousSurgery = @("Appendectomy"); allergies = @(); governorate = "Giza"; address = "789 Pyramid Rd"; hasInsurance = "true" }
)

foreach ($p in $patients) {
    try {
        $body = $p | ConvertTo-Json -Compress
        $resp = Invoke-RestMethod -Uri "$api/Patients" -Method Post -Headers $regHeaders -Body $body
        Write-Host "  [OK] Patient $($p.email)" -ForegroundColor Green
    } catch {
        Write-Host "  [--] Patient $($p.email) : $($_.Exception.Message)" -ForegroundColor DarkYellow
    }
}

$doctors = @(
    @{ firstName = "Khaled"; lastName = "Youssef"; email = "doctor1@test.com"; password = "Doctor@123"; phone = "01100000001"; gender = "Male"; nationalID = "28507102345671"; governorate = "Cairo"; city = "Nasr City"; address = "10 Doctor St"; specialty = "Cardiology"; medicalLevel = "Consultant" },
    @{ firstName = "Noha"; lastName = "Ibrahim"; email = "doctor2@test.com"; password = "Doctor@123"; phone = "01100000002"; gender = "Female"; nationalID = "29011232345672"; governorate = "Alexandria"; city = "Smouha"; address = "25 Health St"; specialty = "Pediatrics"; medicalLevel = "Specialist" }
)

foreach ($d in $doctors) {
    try {
        $body = $d | ConvertTo-Json -Compress
        $resp = Invoke-RestMethod -Uri "$api/Doctors" -Method Post -Headers $regHeaders -Body $body
        Write-Host "  [OK] Doctor $($d.email)" -ForegroundColor Green
    } catch {
        Write-Host "  [--] Doctor $($d.email) : $($_.Exception.Message)" -ForegroundColor DarkYellow
    }
}

$labs = @(
    @{ name = "Alfa Medical Lab"; email = "lab1@test.com"; password = "Lab@123"; phone = "01200000001"; governorate = "Cairo"; city = "Maadi"; address = "15 Lab St" },
    @{ name = "Beta Diagnostics"; email = "lab2@test.com"; password = "Lab@123"; phone = "01200000002"; governorate = "Giza"; city = "Dokki"; address = "8 Analysis Rd" }
)

foreach ($l in $labs) {
    try {
        $body = $l | ConvertTo-Json -Compress
        $resp = Invoke-RestMethod -Uri "$api/Lab" -Method Post -Headers $regHeaders -Body $body
        Write-Host "  [OK] Lab $($l.email)" -ForegroundColor Green
    } catch {
        Write-Host "  [--] Lab $($l.email) : $($_.Exception.Message)" -ForegroundColor DarkYellow
    }
}

# ─────────────────────────────────────────────
# 2. LOGIN & UPDATE PROFILES
# ─────────────────────────────────────────────
Write-Host "`n===== Updating Doctor Profiles =====" -ForegroundColor Cyan

$doctorAccounts = @(
    @{ email = "doctor1@test.com"; password = "Doctor@123"; role = "Doctor";
       profile = @{
           workingDay = @("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday")
           workingHourStart = "09:00"; workingHourEnd = "17:00"
           price = 300; duration = 30
           city = "Nasr City"; governorate = "Cairo"
           specialty = "Cardiology"; medicalLevel = "Consultant"
       }
    },
    @{ email = "doctor2@test.com"; password = "Doctor@123"; role = "Doctor";
       profile = @{
           workingDay = @("Sunday", "Monday", "Tuesday", "Wednesday")
           workingHourStart = "10:00"; workingHourEnd = "18:00"
           price = 200; duration = 45
           city = "Smouha"; governorate = "Alexandria"
           specialty = "Pediatrics"; medicalLevel = "Specialist"
       }
    }
)

foreach ($acct in $doctorAccounts) {
    try {
        $loginBody = @{ email = $acct.email; password = $acct.password; role = $acct.role } | ConvertTo-Json -Compress
        $loginResp = Invoke-RestMethod -Uri "$api/Auth/login" -Method Post -Headers $regHeaders -Body $loginBody
        $token = $loginResp.token
        $authHeaders = @{ "Content-Type" = "application/json"; "Authorization" = "Bearer $token" }

        $profileBody = $acct.profile | ConvertTo-Json -Compress
        $resp = Invoke-RestMethod -Uri "$api/Doctors/profile" -Method Put -Headers $authHeaders -Body $profileBody
        Write-Host "  [OK] $($acct.email) profile updated" -ForegroundColor Green
    } catch {
        Write-Host "  [ERR] $($acct.email) : $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n===== Updating Lab Profiles =====" -ForegroundColor Cyan

$labAccounts = @(
    @{ email = "lab1@test.com"; password = "Lab@123"; role = "Lab";
       profile = @{
           workingDays = @("Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday")
           workingHourStart = "08:00"; workingHourEnd = "20:00"
           duration = 60
           city = "Maadi"; governorate = "Cairo"
           tests = @(
               @{ testName = "Complete Blood Count (CBC)"; price = 150; testDetails = "Complete blood count analysis" },
               @{ testName = "Blood Sugar Test"; price = 80; testDetails = "Fasting blood sugar measurement" },
               @{ testName = "Lipid Profile"; price = 200; testDetails = "Cholesterol and triglycerides panel" },
               @{ testName = "Liver Function Test"; price = 180; testDetails = "Liver enzyme and function panel" },
               @{ testName = "Kidney Function Test"; price = 160; testDetails = "Kidney health assessment" },
               @{ testName = "Thyroid Profile"; price = 250; testDetails = "TSH, T3, T4 analysis" },
               @{ testName = "Vitamin D Test"; price = 300; testDetails = "Vitamin D level measurement" },
               @{ testName = "Iron Studies"; price = 220; testDetails = "Iron, ferritin, TIBC panel" },
               @{ testName = "Urinalysis"; price = 60; testDetails = "Complete urine examination" },
               @{ testName = "ECG"; price = 120; testDetails = "Electrocardiogram test" }
           )
       }
    },
    @{ email = "lab2@test.com"; password = "Lab@123"; role = "Lab";
       profile = @{
           workingDays = @("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday")
           workingHourStart = "09:00"; workingHourEnd = "21:00"
           duration = 45
           city = "Dokki"; governorate = "Giza"
           tests = @(
               @{ testName = "Complete Blood Count (CBC)"; price = 130; testDetails = "Complete blood count analysis" },
               @{ testName = "HbA1c"; price = 100; testDetails = "Glycated hemoglobin for diabetes monitoring" },
               @{ testName = "Lipid Profile"; price = 180; testDetails = "Cholesterol and triglycerides panel" },
               @{ testName = "Liver Function Test"; price = 160; testDetails = "Liver enzyme and function panel" },
               @{ testName = "Kidney Function Test"; price = 140; testDetails = "Kidney health assessment" },
               @{ testName = "Thyroid Profile"; price = 230; testDetails = "TSH, T3, T4 analysis" },
               @{ testName = "Vitamin B12 Test"; price = 280; testDetails = "Vitamin B12 level measurement" },
               @{ testName = "C-Reactive Protein"; price = 90; testDetails = "CRP inflammation marker" },
               @{ testName = "Urinalysis"; price = 50; testDetails = "Complete urine examination" },
               @{ testName = "Hepatitis B Test"; price = 200; testDetails = "HBsAg screening" }
           )
       }
    }
)

foreach ($acct in $labAccounts) {
    try {
        $loginBody = @{ email = $acct.email; password = $acct.password; role = $acct.role } | ConvertTo-Json -Compress
        $loginResp = Invoke-RestMethod -Uri "$api/Auth/login" -Method Post -Headers $regHeaders -Body $loginBody
        $token = $loginResp.token
        $authHeaders = @{ "Content-Type" = "application/json"; "Authorization" = "Bearer $token" }

        $profileBody = $acct.profile | ConvertTo-Json -Compress -Depth 5
        $resp = Invoke-RestMethod -Uri "$api/Lab/profile" -Method Put -Headers $authHeaders -Body $profileBody
        Write-Host "  [OK] $($acct.email) profile updated" -ForegroundColor Green
    } catch {
        Write-Host "  [ERR] $($acct.email) : $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n===== Updating Patient Profiles =====" -ForegroundColor Cyan

$patientAccounts = @(
    @{ email = "patient1@test.com"; password = "Patient@123"; role = "Patient";
       profile = @{
           bloodGroup = "A+"; hasInsurance = "true"
           phone = "01000000001"; governorate = "Cairo"; address = "123 Main St"
           allergies = @(); chronic = @(); previousSurgery = @()
       }
    },
    @{ email = "patient2@test.com"; password = "Patient@123"; role = "Patient";
       profile = @{
           bloodGroup = "O+"; hasInsurance = "false"
           phone = "01000000002"; governorate = "Alexandria"; address = "456 El Corniche"
           allergies = @("Penicillin"); chronic = @("Asthma"); previousSurgery = @()
       }
    },
    @{ email = "patient3@test.com"; password = "Patient@123"; role = "Patient";
       profile = @{
           bloodGroup = "B+"; hasInsurance = "true"
           phone = "01000000003"; governorate = "Giza"; address = "789 Pyramid Rd"
           allergies = @(); chronic = @("Diabetes"); previousSurgery = @("Appendectomy")
       }
    }
)

foreach ($acct in $patientAccounts) {
    try {
        $loginBody = @{ email = $acct.email; password = $acct.password; role = $acct.role } | ConvertTo-Json -Compress
        $loginResp = Invoke-RestMethod -Uri "$api/Auth/login" -Method Post -Headers $regHeaders -Body $loginBody
        $token = $loginResp.token
        $authHeaders = @{ "Content-Type" = "application/json"; "Authorization" = "Bearer $token" }

        $profileBody = $acct.profile | ConvertTo-Json -Compress -Depth 3
        $resp = Invoke-RestMethod -Uri "$api/Patients/profile" -Method Put -Headers $authHeaders -Body $profileBody
        Write-Host "  [OK] $($acct.email) profile updated" -ForegroundColor Green
    } catch {
        Write-Host "  [ERR] $($acct.email) : $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n===== All Done =====`n" -ForegroundColor Green
Write-Host "Login credentials:" -ForegroundColor Yellow
Write-Host "  Patients:  patient1@test.com / Patient@123" -ForegroundColor White
Write-Host "             patient2@test.com / Patient@123"
Write-Host "             patient3@test.com / Patient@123"
Write-Host "  Doctors:   doctor1@test.com / Doctor@123" -ForegroundColor White
Write-Host "             doctor2@test.com / Doctor@123"
Write-Host "  Labs:      lab1@test.com / Lab@123" -ForegroundColor White
Write-Host "             lab2@test.com / Lab@123"
