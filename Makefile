server:
	. env/bin/activate && cd api && python manage.py runserver

redis:
	redis-server