import json 

dic = {"nodes":[],"links":[]}
num = 0
with open("cc.json","r") as in_file:
	for line in in_file:
		line = json.loads(line)
		for d in line:
			for key,value in d.iteritems():
				dic['nodes'].append({"id":d["codigo_disciplina"],"name":d["disciplina"],"group":num/8 + 1})
				if d["pre_requisitos"] != []:
					for k in d["pre_requisitos"]:
						dic["links"].append({"source":d["codigo_disciplina"],"target":k,"value":num/8 + 1})

with open("cc_1.json","w") as out_file:
	out_file.write(str(dic))
