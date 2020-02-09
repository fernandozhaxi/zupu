安装包：
`pip install -i https://pypi.doubanio.com/simple/ -r requirements.txt`

生成requirements.txt:

`pip freeze > requirements.txt`

注意：
  database现在是在云端

问题：
  1， 没有办法把zupu和quickstart集成到一起，老是说User authentication的问题。所以我就干脆disable了所有zupu里的功能。如果需要再慢慢加上

Run server:
  python manage.py runserver --settings=zupu.settings_lliu_new

查看person 1 的信息
  个人信息
  http://127.0.0.1:8000/persons/1
  
  直接亲属
  http://127.0.0.1:8000/1/relatives

