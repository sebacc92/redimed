const { createClient } = require('@libsql/client');
const client = createClient({
  url: 'libsql://redimed-sebacc92.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzU3MDcxNTQsImlkIjoiMDE5ZDcwNjQtYmUwMS03MmQ0LWEzNWUtMTVmZWIxZDFmNzE1IiwicmlkIjoiY2YxZGM0ZGEtNDkzMS00Nzk0LWJkZTctMGFhNmRiMWE2MmM1In0.__stREErinbC6-RFvOrShuYsaOGR2kZsrRyK6wdL4KzhI1-sVeUZEGEAaM6fRm45yMjUrXYLV5UkG-Ki91tcBQ'
});

client.execute('select * from site_settings')
  .then(res => { console.log("SUCCESS:", res.rows); process.exit(0); })
  .catch(err => { console.error("ERROR:", err.message); process.exit(1); });
