// Banco de perguntas do Snake: Bancos de Dados, do inicial ao avançado.
//
// Como editar (não precisa mexer no código do jogo):
//   q: o enunciado da pergunta (até 160 caracteres)
//   a: a lista de alternativas, com pelo menos 4 itens de até 40 caracteres cada;
//      a PRIMEIRA alternativa é sempre a correta (o jogo embaralha ao mostrar)
//   e: uma explicação curta, mostrada depois que o jogador responde
//   m: o tópico, usado para sortear as perguntas de forma equilibrada
//
// Os tópicos vão do mais inicial ao mais avançado:
//   Fundamentos -> Modelagem -> SQL básico -> SQL avançado -> Transações e índices -> NoSQL e arquitetura
//
// Perguntas fora desse formato são ignoradas pelo jogo.
// Todas as perguntas abaixo são originais, escritas para este projeto.

const PERGUNTAS = [
  // ---------- Fundamentos (inicial) ----------
  {
    q: "O que é um banco de dados?",
    a: ["Coleção organizada de dados", "Uma planilha impressa", "Um sistema operacional", "Um navegador de internet"],
    e: "Um banco de dados guarda dados de forma organizada, para que possam ser consultados e atualizados.",
    m: "Fundamentos"
  },
  {
    q: "O que significa a sigla SGBD?",
    a: ["Sistema Gerenciador de Banco de Dados", "Sistema Geral de Backup Digital", "Servidor Global de Bases de Dados", "Sistema Gráfico de Bancos Distribuídos"],
    e: "O SGBD é o programa que cria, controla e protege os bancos de dados, como o PostgreSQL e o MySQL.",
    m: "Fundamentos"
  },
  {
    q: "Em um banco de dados relacional, como os dados são organizados?",
    a: ["Em tabelas com linhas e colunas", "Em pastas de arquivos de texto", "Apenas em grafos de nós", "Em listas de imagens"],
    e: "No modelo relacional, os dados ficam em tabelas (relações), formadas por linhas e colunas.",
    m: "Fundamentos"
  },
  {
    q: "O que representa uma linha (ou registro) de uma tabela?",
    a: ["Uma ocorrência dos dados da tabela", "O nome de uma coluna", "Uma cópia do banco", "Um tipo de índice"],
    e: "Cada linha guarda os dados de uma ocorrência, como um aluno numa tabela de alunos.",
    m: "Fundamentos"
  },
  {
    q: "Qual é a função de uma chave primária?",
    a: ["Identificar cada linha de forma única", "Ordenar a tabela por nome", "Criptografar os dados", "Apagar linhas repetidas sozinha"],
    e: "A chave primária identifica cada linha de modo único, sem repetição.",
    m: "Fundamentos"
  },
  {
    q: "Uma chave primária pode ter valor nulo (NULL)?",
    a: ["Não, nunca", "Sim, sempre", "Somente em tabelas vazias", "Somente se for texto"],
    e: "A chave primária não pode ser nula, porque precisa identificar a linha.",
    m: "Fundamentos"
  },
  {
    q: "Qual é a linguagem padrão para consultar bancos de dados relacionais?",
    a: ["SQL", "HTML", "CSS", "XML"],
    e: "SQL (Structured Query Language) é a linguagem padrão dos bancos relacionais.",
    m: "Fundamentos"
  },
  {
    q: "Qual destes é um SGBD relacional?",
    a: ["PostgreSQL", "Photoshop", "Node.js", "Bootstrap"],
    e: "PostgreSQL é um SGBD relacional de código aberto. Os outros são programas ou bibliotecas de outra área.",
    m: "Fundamentos"
  },
  {
    q: "Um campo do tipo VARCHAR guarda o quê?",
    a: ["Texto de tamanho variável", "Número inteiro", "Data e hora", "Verdadeiro ou falso"],
    e: "VARCHAR guarda texto e aceita tamanhos diferentes, até um limite definido.",
    m: "Fundamentos"
  },
  {
    q: "Para que serve um backup de um banco de dados?",
    a: ["Recuperar os dados após uma falha", "Deixar as consultas mais rápidas", "Criar tabelas sozinho", "Trocar o SGBD"],
    e: "O backup é uma cópia de segurança que permite restaurar os dados depois de uma falha ou de um erro.",
    m: "Fundamentos"
  },

  // ---------- Modelagem ----------
  {
    q: "No modelo entidade-relacionamento, o que é uma entidade?",
    a: ["Objeto do mundo real com dados", "Um comando SQL", "Uma senha de acesso", "Uma cópia de segurança"],
    e: "Uma entidade representa algo sobre o qual guardamos dados, como Aluno, Curso ou Pedido.",
    m: "Modelagem"
  },
  {
    q: "O que é um atributo em uma entidade?",
    a: ["Propriedade que descreve a entidade", "Uma tabela inteira", "Um usuário do banco", "Um tipo de servidor"],
    e: "Atributos descrevem a entidade. Em Aluno, por exemplo: nome, matrícula e data de nascimento.",
    m: "Modelagem"
  },
  {
    q: "O que é uma chave estrangeira?",
    a: ["Coluna que aponta para outra tabela", "Senha usada para entrar no banco", "Índice que ordena a tabela", "Nome alternativo da tabela"],
    e: "A chave estrangeira guarda o valor da chave primária de outra tabela e cria o vínculo entre elas.",
    m: "Modelagem"
  },
  {
    q: "Um cliente faz vários pedidos e cada pedido é de um só cliente. Qual é a cardinalidade?",
    a: ["Um para muitos (1:N)", "Um para um (1:1)", "Muitos para muitos (N:N)", "Nenhuma relação"],
    e: "Um cliente se relaciona com muitos pedidos, e cada pedido com um só cliente: relação 1:N.",
    m: "Modelagem"
  },
  {
    q: "Como se implementa uma relação muitos para muitos no modelo relacional?",
    a: ["Com uma tabela associativa", "Com uma única coluna", "Duplicando as tabelas", "Com uma visão (view)"],
    e: "Cria-se uma tabela intermediária, com as chaves das duas tabelas, como Matrícula ligando Aluno e Disciplina.",
    m: "Modelagem"
  },
  {
    q: "O que descreve o modelo lógico de um banco de dados?",
    a: ["Tabelas, colunas e chaves", "Só o desenho das telas", "O código do servidor", "O backup do banco"],
    e: "O modelo lógico define tabelas, colunas e chaves, sem depender dos detalhes de armazenamento do SGBD.",
    m: "Modelagem"
  },
  {
    q: "Qual diagrama é usado para representar entidades e relacionamentos?",
    a: ["Diagrama entidade-relacionamento (DER)", "Fluxograma de rede", "Diagrama de Gantt", "Organograma"],
    e: "O DER mostra as entidades, seus atributos e como elas se relacionam.",
    m: "Modelagem"
  },
  {
    q: "O que é integridade referencial?",
    a: ["Garantir que chaves estrangeiras existam", "Impedir que a tabela cresça", "Proibir consultas simultâneas", "Criptografar todas as colunas"],
    e: "A integridade referencial impede que uma chave estrangeira aponte para uma linha que não existe.",
    m: "Modelagem"
  },
  {
    q: "Qual é o objetivo da normalização?",
    a: ["Reduzir redundância e anomalias", "Aumentar a duplicação de dados", "Apagar as chaves primárias", "Juntar tudo em uma só tabela"],
    e: "A normalização organiza as tabelas para evitar dados repetidos e problemas ao inserir, alterar e apagar.",
    m: "Modelagem"
  },
  {
    q: "Uma tabela está na 1ª forma normal (1FN) quando:",
    a: ["Cada campo guarda um único valor", "Não tem chave primária", "Tem apenas uma coluna", "Todos os campos são nulos"],
    e: "Na 1FN os valores são atômicos: um campo não guarda listas nem grupos de valores.",
    m: "Modelagem"
  },

  // ---------- SQL básico ----------
  {
    q: "Qual comando SQL consulta dados de uma tabela?",
    a: ["SELECT", "INSERT", "DELETE", "CREATE"],
    e: "SELECT lê e devolve dados. INSERT insere, DELETE apaga e CREATE cria objetos.",
    m: "SQL básico"
  },
  {
    q: "Qual comando insere uma nova linha em uma tabela?",
    a: ["INSERT INTO", "SELECT FROM", "DROP TABLE", "ORDER BY"],
    e: "INSERT INTO adiciona linhas novas: INSERT INTO alunos (nome) VALUES ('Ana');",
    m: "SQL básico"
  },
  {
    q: "Qual cláusula filtra as linhas que a consulta devolve?",
    a: ["WHERE", "ORDER BY", "GROUP BY", "LIMIT"],
    e: "WHERE mantém só as linhas que atendem à condição. ORDER BY ordena e GROUP BY agrupa.",
    m: "SQL básico"
  },
  {
    q: "Qual cláusula ordena o resultado de uma consulta?",
    a: ["ORDER BY", "GROUP BY", "SORT WHERE", "ARRANGE"],
    e: "ORDER BY ordena o resultado, de forma crescente (ASC) ou decrescente (DESC).",
    m: "SQL básico"
  },
  {
    q: "O que faz o comando SELECT * FROM alunos;",
    a: ["Devolve todas as colunas de alunos", "Apaga a tabela alunos", "Cria a tabela alunos", "Devolve só a primeira coluna"],
    e: "O asterisco (*) significa todas as colunas, e a consulta devolve todas as linhas da tabela.",
    m: "SQL básico"
  },
  {
    q: "Qual comando altera dados que já existem em uma tabela?",
    a: ["UPDATE", "ALTER TABLE", "MODIFY ROW", "CHANGE"],
    e: "UPDATE muda os valores das linhas. ALTER TABLE muda a estrutura da tabela, não os dados.",
    m: "SQL básico"
  },
  {
    q: "O que acontece com DELETE FROM alunos; quando não há WHERE?",
    a: ["Remove todas as linhas da tabela", "Não remove nada", "Remove só a primeira linha", "Apaga o banco de dados"],
    e: "Sem WHERE, o DELETE atinge todas as linhas. A tabela continua existindo, mas vazia.",
    m: "SQL básico"
  },
  {
    q: "Qual função de agregação conta o número de linhas?",
    a: ["COUNT", "SUM", "AVG", "MAX"],
    e: "COUNT conta linhas. SUM soma, AVG calcula a média e MAX devolve o maior valor.",
    m: "SQL básico"
  },
  {
    q: "Qual condição encontra nomes que começam com a letra A?",
    a: ["nome LIKE 'A%'", "nome = 'A'", "nome LIKE '%A'", "nome IN ('A%')"],
    e: "No LIKE, o símbolo % representa qualquer texto. 'A%' é tudo o que começa com A.",
    m: "SQL básico"
  },
  {
    q: "Qual comando cria uma nova tabela?",
    a: ["CREATE TABLE", "MAKE TABLE", "NEW TABLE", "INSERT TABLE"],
    e: "CREATE TABLE define o nome da tabela, suas colunas e as regras (chaves e restrições).",
    m: "SQL básico"
  },

  // ---------- SQL avançado ----------
  {
    q: "O que o INNER JOIN devolve?",
    a: ["Só as linhas com correspondência", "Todas as linhas de ambas", "Só as linhas sem correspondência", "Um produto sem condição"],
    e: "O INNER JOIN devolve apenas as linhas que têm correspondência nas duas tabelas.",
    m: "SQL avançado"
  },
  {
    q: "O que o LEFT JOIN devolve?",
    a: ["Todas as linhas da tabela da esquerda", "Só as linhas da tabela da direita", "Só as linhas sem correspondência", "Nenhuma linha com NULL"],
    e: "O LEFT JOIN mantém todas as linhas da esquerda. Sem correspondência, as colunas da direita vêm como NULL.",
    m: "SQL avançado"
  },
  {
    q: "Qual cláusula filtra grupos depois de um GROUP BY?",
    a: ["HAVING", "WHERE", "LIMIT", "DISTINCT"],
    e: "HAVING filtra grupos já agregados. O WHERE filtra as linhas antes do agrupamento.",
    m: "SQL avançado"
  },
  {
    q: "O que é uma subconsulta?",
    a: ["Uma consulta dentro de outra consulta", "Uma tabela temporária vazia", "Uma cópia do banco", "Um tipo de índice"],
    e: "A subconsulta é um SELECT usado dentro de outro comando, geralmente entre parênteses.",
    m: "SQL avançado"
  },
  {
    q: "O que faz a função de janela ROW_NUMBER() OVER (ORDER BY nota DESC)?",
    a: ["Numera as linhas pela ordem da nota", "Soma todas as notas", "Apaga linhas repetidas", "Cria um índice na nota"],
    e: "As funções de janela calculam sobre um conjunto de linhas sem juntá-las em uma só. Aqui, cada linha recebe um número.",
    m: "SQL avançado"
  },
  {
    q: "Para que serve uma VIEW (visão)?",
    a: ["Salvar uma consulta como tabela virtual", "Guardar uma cópia física dos dados", "Criptografar uma coluna", "Acelerar todo INSERT"],
    e: "A view guarda uma consulta com um nome. Ela pode ser usada como se fosse uma tabela.",
    m: "SQL avançado"
  },
  {
    q: "Qual é a diferença entre UNION e UNION ALL?",
    a: ["UNION remove duplicatas; ALL mantém", "UNION mantém duplicatas; ALL remove", "Não há diferença", "ALL só funciona com números"],
    e: "UNION elimina linhas repetidas do resultado. UNION ALL as mantém e costuma ser mais rápido.",
    m: "SQL avançado"
  },
  {
    q: "O que uma CTE (cláusula WITH) permite fazer?",
    a: ["Nomear uma consulta temporária", "Criar um usuário", "Fazer backup", "Mudar o tipo de uma coluna"],
    e: "A CTE dá um nome a um resultado intermediário, o que deixa consultas complexas mais legíveis.",
    m: "SQL avançado"
  },
  {
    q: "Ao calcular AVG(nota), o que acontece com os valores NULL?",
    a: ["São ignorados", "Contam como zero", "Causam erro", "Contam como um"],
    e: "As funções de agregação, exceto COUNT(*), ignoram os NULL. A média usa só os valores presentes.",
    m: "SQL avançado"
  },
  {
    q: "O que é uma stored procedure (procedimento armazenado)?",
    a: ["Bloco de código SQL salvo no banco", "Uma tabela somente leitura", "Um backup automático", "Um tipo de índice"],
    e: "É um conjunto de comandos guardado no servidor, que pode ser executado pelo nome e receber parâmetros.",
    m: "SQL avançado"
  },

  // ---------- Transações e índices ----------
  {
    q: "O que é uma transação em um banco de dados?",
    a: ["Conjunto de operações tratado como um só", "Uma consulta que nunca falha", "Um backup incremental", "Uma tabela temporária"],
    e: "Uma transação agrupa operações que devem dar certo juntas ou não valer, como uma transferência bancária.",
    m: "Transações e índices"
  },
  {
    q: "Qual propriedade ACID garante o \"tudo ou nada\" em uma transação?",
    a: ["Atomicidade", "Consistência", "Isolamento", "Durabilidade"],
    e: "Atomicidade: ou todas as operações da transação são aplicadas, ou nenhuma delas.",
    m: "Transações e índices"
  },
  {
    q: "Qual comando desfaz as alterações de uma transação em andamento?",
    a: ["ROLLBACK", "COMMIT", "SAVEPOINT", "GRANT"],
    e: "ROLLBACK cancela a transação e volta ao estado anterior. COMMIT confirma as alterações.",
    m: "Transações e índices"
  },
  {
    q: "O que o comando COMMIT faz?",
    a: ["Confirma as alterações da transação", "Desfaz todas as alterações", "Apaga a tabela", "Cria um índice"],
    e: "COMMIT torna as alterações da transação definitivas e visíveis para as outras conexões.",
    m: "Transações e índices"
  },
  {
    q: "Para que serve um índice em uma coluna?",
    a: ["Acelerar buscas nessa coluna", "Duplicar a tabela", "Impedir o uso de SELECT", "Criptografar os dados"],
    e: "O índice funciona como o sumário de um livro: ajuda o SGBD a achar as linhas sem varrer a tabela toda.",
    m: "Transações e índices"
  },
  {
    q: "Qual é o custo de criar índices demais?",
    a: ["Escritas mais lentas e mais espaço", "Consultas sempre mais lentas", "Perda da chave primária", "Bloqueio do banco inteiro"],
    e: "Cada INSERT, UPDATE e DELETE também precisa atualizar os índices, e eles ocupam espaço em disco.",
    m: "Transações e índices"
  },
  {
    q: "O que a propriedade Durabilidade (o D do ACID) garante?",
    a: ["Dados confirmados sobrevivem a falhas", "Dados nunca podem ser alterados", "Consultas sempre rápidas", "Tabelas sem chave"],
    e: "Depois do COMMIT, os dados permanecem gravados mesmo se o servidor cair.",
    m: "Transações e índices"
  },
  {
    q: "O que é um deadlock (impasse) em um banco de dados?",
    a: ["Transações esperando uma à outra", "Uma consulta muito lenta", "Um índice corrompido", "Um backup incompleto"],
    e: "No deadlock, cada transação espera um recurso que a outra segura. O SGBD encerra uma delas para desfazer o impasse.",
    m: "Transações e índices"
  },
  {
    q: "O que é uma leitura suja (dirty read)?",
    a: ["Ler dados ainda não confirmados", "Ler uma tabela vazia", "Ler dados criptografados", "Ler dados apagados de vez"],
    e: "Ocorre quando uma transação lê alterações de outra que ainda não deu COMMIT e que pode ser desfeita.",
    m: "Transações e índices"
  },
  {
    q: "O que o comando EXPLAIN mostra sobre uma consulta?",
    a: ["O plano de execução escolhido", "O nome de quem a escreveu", "O tamanho do disco", "A senha do banco"],
    e: "EXPLAIN mostra como o SGBD pretende executar a consulta, por exemplo se vai usar um índice.",
    m: "Transações e índices"
  },

  // ---------- NoSQL e arquitetura (avançado) ----------
  {
    q: "Qual destes é um banco NoSQL orientado a documentos?",
    a: ["MongoDB", "MySQL", "Oracle Database", "SQLite"],
    e: "O MongoDB guarda documentos em formato parecido com JSON. Os outros três são relacionais.",
    m: "NoSQL e arquitetura"
  },
  {
    q: "Como o Redis guarda os dados, principalmente?",
    a: ["Chave-valor em memória", "Tabelas relacionais", "Grafos de arestas", "Colunas de texto"],
    e: "O Redis é um banco chave-valor que trabalha em memória, por isso é muito rápido. Serve bem para cache.",
    m: "NoSQL e arquitetura"
  },
  {
    q: "Com uma falha de rede, o teorema CAP diz que o sistema escolhe entre quais duas propriedades?",
    a: ["Consistência e disponibilidade", "Segurança e desempenho", "Custo e agilidade", "Escala e simplicidade"],
    e: "Em uma partição de rede, um sistema distribuído precisa escolher entre consistência e disponibilidade.",
    m: "NoSQL e arquitetura"
  },
  {
    q: "O que é replicação de dados?",
    a: ["Copiar dados entre servidores", "Apagar dados antigos", "Comprimir tabelas", "Trocar o SGBD"],
    e: "Na replicação, os dados são copiados para outros servidores. Isso dá mais disponibilidade e distribui as leituras.",
    m: "NoSQL e arquitetura"
  },
  {
    q: "O que é sharding (particionamento horizontal)?",
    a: ["Dividir os dados entre vários servidores", "Criar um índice único", "Criptografar o disco", "Reduzir a memória usada"],
    e: "No sharding, as linhas são distribuídas em vários servidores (shards), o que ajuda o banco a crescer.",
    m: "NoSQL e arquitetura"
  },
  {
    q: "Qual destes é um banco de dados orientado a grafos?",
    a: ["Neo4j", "Redis", "PostgreSQL", "Cassandra"],
    e: "O Neo4j guarda nós e relacionamentos, e é ótimo para redes sociais e recomendações.",
    m: "NoSQL e arquitetura"
  },
  {
    q: "O que é um data warehouse (armazém de dados)?",
    a: ["Base histórica para análises", "Um servidor de e-mail", "Uma tabela temporária", "Um índice de texto"],
    e: "O data warehouse reúne dados históricos de várias fontes, organizados para análises e relatórios.",
    m: "NoSQL e arquitetura"
  },
  {
    q: "O que caracteriza o modelo BASE, comum em bancos NoSQL?",
    a: ["Consistência eventual", "Consistência imediata sempre", "Transações ACID rígidas", "Ausência de replicação"],
    e: "BASE prioriza disponibilidade. Os dados podem ficar diferentes por um tempo e chegam à consistência depois.",
    m: "NoSQL e arquitetura"
  },
  {
    q: "O que significa a sigla ETL em projetos de dados?",
    a: ["Extrair, transformar e carregar", "Editar, testar e liberar", "Enviar, trocar e limpar", "Exportar tabelas locais"],
    e: "ETL é o processo de extrair dados das fontes, transformá-los e carregá-los em outro banco, como um data warehouse.",
    m: "NoSQL e arquitetura"
  },
  {
    q: "Qual técnica guarda resultados de consultas em memória para leituras mais rápidas?",
    a: ["Cache", "Rollback", "Normalização", "Trigger"],
    e: "O cache guarda em memória o que foi lido com frequência, o que reduz a carga sobre o banco.",
    m: "NoSQL e arquitetura"
  }
];
