# Define the possible withdrawerId values
$withdrawerIds = @(
    "667c5985671d7cec2e03fab2",
    "667c5bab671d7cec2e03fab5",
    "667c5bab671d7cec2e03fab6",
    "667c5c99671d7cec2e03fab7",
    "667c5cbb671d7cec2e03fab8"
)

# Number of entries to create
$numEntries = 10

# Initialize an array to hold the JSON objects
$jsonArray = @()

# Generate random entries
for ($i = 0; $i -lt $numEntries; $i++) {
    $id = [System.Guid]::NewGuid().ToString("N").Substring(0, 24)
    $withdrawerId = $withdrawerIds | Get-Random
    $time = (Get-Date -Year 2024 -Month (Get-Random -Minimum 1 -Maximum 7) -Day (Get-Random -Minimum 1 -Maximum 28)).ToString("yyyy-MM-ddTHH:mm:ss.000Z")

    $jsonObject = @{
        "withdrawerId" = @{
            "$oid" = $withdrawerId
        }
        "time" = @{
            "$date" = $time
        }
    }

    $jsonArray += $jsonObject
}

# Convert the array to JSON and save to a file
$jsonArray | ConvertTo-Json -Depth 3 | Out-File -FilePath "output.json" -Encoding utf8
