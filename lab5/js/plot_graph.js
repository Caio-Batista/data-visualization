function draw(file, id) {
	d3.json(file, function(error, resp) {
		if (error) throw error;

		var width = 800;
		var height = 450;

		var svg = d3.select(id)
			.append("svg")
			.attr('version', '1.1')
			.attr('viewBox', '0 0 '+width+' '+height)
			.attr('width', '100%');

		var color = d3.scaleOrdinal(d3.schemeCategory10);
		var colorBorder = d3.scaleOrdinal(d3.schemeCategory20b);

		var simulation = d3.forceSimulation()
			.force("link", d3.forceLink().id(function(d) { return d.id; }))
			.force("charge", d3.forceManyBody().strength(-100))
			.force("center", d3.forceCenter(width / 2, height / 2))
			.force("forceY", d3.forceY(-15))
			.force("forceX", d3.forceX(-15));

		var links = [];
		resp.forEach(function(d) {
			d.pre_requisitos.forEach(function(p){
				links.push({source: String(d.codigo_disciplina), target: String(p)});
			});
			if (d.pre_requisitos.length === 0 && d.semestre === 1) {
				links.push({source: String(0), target: String(d.codigo_disciplina)})
			} else if (d.pos_requisitos.length === 0) {
				links.push({source: String(d.codigo_disciplina), target: String(1000)})
			}
		})

		var nodes = resp.map(function(d) {
			return {id: String(d.codigo_disciplina),
					codigo_departamento : d.codigo_departamento,
					nome : d.disciplina,
					creditos: d.creditos,
					semestre: d.semestre};
		});

		nodes.push({
			id: '0',
			codigo_departamento : 0,
			nome : "Início do curso",
			creditos: 10
		});

		nodes.push({
			id: '1000',
			codigo_departamento : 0,
			nome : "Fim do curso",
			creditos: 10
		});

		console.dir(links);
		console.dir(nodes);

		var link = svg.append("g")
				.attr("class", "link")
			.selectAll("line")
			    .data(links)
			.enter().append("line");

		var node = svg.append("g")
			    .attr("class", "nodes")
			.selectAll("circle")
			    .data(nodes)
			.enter().append("circle")
			    .attr("fill", function(d) { return color(d.creditos); })
			    .attr("r", function(d) { return d.semestre*2; })
			    .attr("stroke-width", function(d) { return (d.creditos+1); })
			.call(d3.drag()
			    .on("start", dragstarted)
			    .on("drag", dragged)
			    .on("end", dragended));

		simulation
			.nodes(nodes)
			.on("tick", ticked);

		simulation.force("link")
			.links(links);

		function ticked() {
			link
				.attr("x1", function(d) { return d.source.x; })
			    .attr("y1", function(d) { return d.source.y; })
			    .attr("x2", function(d) { return d.target.x; })
			    .attr("y2", function(d) { return d.target.y; });

			node
			    .attr("cx", function(d) { return d.x; })
			    .attr("cy", function(d) { return d.y; });
		}

		function dragstarted(d) {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(d) {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		}

		function dragended(d) {
			if (!d3.event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}
	});
}


draw("dados/ciencia_da_computacao_d_cg.json", "#computacao");
draw("dados/engenharia_civil_d_cg.json", "#civil");
draw("dados/engenharia_eletrica_cg.json", "#eletrica");

