# backup data.db to backup.sql
mysqldump -u admin -p rapid_tracing > backup.sql
# restore data.db from backup.sql
mysql -u admin -p rapid_tracing_backup < backup.sql