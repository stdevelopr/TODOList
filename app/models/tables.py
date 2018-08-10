from app import db
from app import ma

# create the database model
class Todo(db.Model):
	__tablename__= 'todo_list'
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	item = db.Column(db.String(80), unique=False, nullable=False)
	status = db.Column(db.Boolean, default=False)

# serialize the model
class TodoSchema(ma.Schema):
    class Meta:
       fields = ('id', 'item', 'status')


db.create_all()