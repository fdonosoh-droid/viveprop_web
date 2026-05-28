@echo off
cd /d "C:\AI\viveprop_web\viveprop-platform"
python tools\gsheet_to_stock.py >> tasks\log_stock.txt 2>&1
