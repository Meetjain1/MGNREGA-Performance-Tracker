-- Check if tables exist and have data
SELECT name FROM sqlite_master WHERE type='table';
SELECT COUNT(*) as districts FROM districts;
SELECT COUNT(*) as cached_data FROM cached_mgnrega_data;

-- Sample districts to verify
SELECT id, name, stateCode, stateName FROM districts LIMIT 5;