echo "select DBS.NAME, TBL_NAME, COLUMN_NAME, TYPE_NAME, COMMENT from DBS join TBLS on DBS.DB_ID = TBLS.DB_ID left join COLUMNS on TBLS.SD_ID=COLUMNS.SD_ID" | db hive_test >htags
