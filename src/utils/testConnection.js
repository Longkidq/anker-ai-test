// 測試 Supabase 數據庫連接
import { supabase } from '../config/supabase'

export async function testConnection() {
  try {
    console.log('正在測試 Supabase 連接...')
    
    // 測試查詢用戶表（應該返回空數組，因為還沒有數據）
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ 連接失敗:', error.message)
      return false
    }
    
    console.log('✅ Supabase 連接成功！')
    console.log('✅ 數據表已正確創建')
    return true
  } catch (err) {
    console.error('❌ 連接錯誤:', err.message)
    return false
  }
}

