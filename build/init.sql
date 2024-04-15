CREATE TABLE `alunni` (
  `id` int(11) NOT NULL,
  `nome` varchar(20) NOT NULL,
  `cognome` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `alunni` (`id`, `nome`, `cognome`) VALUES
(1, 'claudio', 'benve'),
(2, 'ivan', 'bruno');

ALTER TABLE `alunni`
ADD PRIMARY KEY (`id`);

ALTER TABLE `alunni`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
