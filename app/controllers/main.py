from app import app
from app.models.tables import Todo, TodoSchema
from flask import Flask, render_template, request, jsonify
from sqlalchemy.sql.expression import func

from app import db
from app import ma

#schema to serialize
single_schema = TodoSchema()
multiple_schema = TodoSchema(many=True)

#main route
@app.route("/", methods=['GET', 'POST'])
def index():
	# create a list with all the entries
	list = Todo.query.all()
	#serialized output
	output = multiple_schema.dump(list).data

	#CRUD actions via AJAX
	#create todo (receives 'todo', save and returns an object contaning a new_id {'new_id':new_id} or an error string)
	if request.method == 'POST' and request.headers['CRUD'] == 'CREATE':
		todo = request.form['todo']
		if todo:
			try:
				t = Todo(item=todo)
				db.session.add(t)
				db.session.commit()
				new_id = str(db.session.query(func.max(Todo.id)).scalar())
				return(jsonify({'new_id':new_id}))
			except Exception as e:
				return('error'+str(e))
		else:
			return('write a new todo')

	#read all todos (returns all rows from the table)
	elif request.method == 'POST' and request.headers['CRUD'] == 'ALL':
		list = Todo.query.all()
		output = multiple_schema.dump(list).data
		return jsonify(output)

	#read completed todos (returns all rows where status == true)
	elif request.method == 'POST' and request.headers['CRUD'] == 'COMPLETED':
		list = Todo.query.filter(Todo.status==True)
		output = multiple_schema.dump(list).data
		return jsonify(output)

	#read pending todos (returns all rows where status == false)
	elif request.method == 'POST' and request.headers['CRUD'] == 'PENDING':
		list = Todo.query.filter(Todo.status==False)
		output = multiple_schema.dump(list).data
		return jsonify(output)

	#update todo (receives 'id', 'todo', 'status', save and returns string 'success' or an error string)
	elif request.method == 'POST' and request.headers['CRUD'] == 'UP':
		try:
			id = request.form['id']
			todo = request.form['todo']
			status = request.form['status']
			if status == 'true':
				status = True
			elif status=='false':
				status = False
			Todo.query.filter(Todo.id == id).update({'item':todo, 'status':status})
			db.session.commit()
			return('success')
		except Exception as e:
			return('error'+str(e))

	#delete todo (receives 'id', delete and returns string 'success' or an error string)
	elif request.method == 'POST' and request.headers['CRUD'] == 'DEL':
		try:
			id = request.form['id']
			Todo.query.filter(Todo.id == id).delete()
			db.session.commit()
			return('success')
		except Exception as e:
			return('error'+str(e))

	return render_template('index.html', list = list)