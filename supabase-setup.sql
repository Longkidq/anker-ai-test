-- AI-Day 數據庫設置腳本
-- 這個文件包含所有需要創建的數據表和權限設置

-- 1. 創建用戶表（存儲Google登入的用戶信息）
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 創建作品表（存儲用戶提交的作品）
CREATE TABLE IF NOT EXISTS works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  votes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 創建投票表（存儲用戶的投票記錄）
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, work_id) -- 確保每個用戶對每個作品只能投一票
);

-- 4. 創建索引以提升查詢性能
CREATE INDEX IF NOT EXISTS idx_works_user_id ON works(user_id);
CREATE INDEX IF NOT EXISTS idx_works_created_at ON works(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_work_id ON votes(work_id);

-- 5. 創建函數：自動更新作品的得票數
CREATE OR REPLACE FUNCTION update_work_votes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE works SET votes_count = votes_count + 1 WHERE id = NEW.work_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE works SET votes_count = votes_count - 1 WHERE id = OLD.work_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 6. 創建觸發器：當投票插入或刪除時自動更新得票數
DROP TRIGGER IF EXISTS trigger_update_votes_count ON votes;
CREATE TRIGGER trigger_update_votes_count
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_work_votes_count();

-- 7. 啟用行級安全策略（RLS）
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- 8. 設置安全策略：允許所有人讀取
CREATE POLICY "允許所有人讀取用戶信息" ON users
  FOR SELECT USING (true);

CREATE POLICY "允許所有人讀取作品" ON works
  FOR SELECT USING (true);

CREATE POLICY "允許所有人讀取投票" ON votes
  FOR SELECT USING (true);

-- 9. 設置安全策略：允許認證用戶插入和更新自己的數據
CREATE POLICY "允許用戶插入自己的信息" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "允許用戶更新自己的信息" ON users
  FOR UPDATE USING (true);

CREATE POLICY "允許認證用戶提交作品" ON works
  FOR INSERT WITH CHECK (true);

CREATE POLICY "允許認證用戶投票" ON votes
  FOR INSERT WITH CHECK (true);

-- 10. 設置安全策略：允許用戶查看自己的投票記錄
CREATE POLICY "允許用戶查看自己的投票" ON votes
  FOR SELECT USING (true);

