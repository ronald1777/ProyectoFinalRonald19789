INSERT INTO public.items (
  id, nombre, "categoriaId", estado, puntuacion,
  "fechaRegistro", "fechaActividad", notas, atributos, activo
)
VALUES
('1001', 'Kaguya-sama Love is War', 'romance', 'leyendo', NULL, NOW()::text, NOW()::text, '', '{"capLeidos":35,"capTotales":281,"portadaUrl":"https://raw.githubusercontent.com/ronald1777/ProyectoFinalRonald19789/38c2fad1759adf1b3463678af44911d201c3b174/portadas/Kaguya_sama.jpg"}'::jsonb, TRUE),
('1002', 'Mikadono sanshimai wa angai choroi', 'romance', 'leyendo', NULL, NOW()::text, NOW()::text, '', '{"capLeidos":70,"capTotales":205,"portadaUrl":"https://raw.githubusercontent.com/ronald1777/ProyectoFinalRonald19789/ca5ffbe3ee671cffd8ac128b6a185f2126df14c2/portadas/Mikadono%20sanshimai%20wa%20angai%20choroi%20.jpeg"}'::jsonb, TRUE),
('1003', 'Eyeshield 21', 'spocon', 'leyendo', NULL, NOW()::text, NOW()::text, '', '{"capLeidos":54,"capTotales":333,"portadaUrl":"https://raw.githubusercontent.com/ronald1777/ProyectoFinalRonald19789/7edf2d3a636ec5ec67d4207341be5b479d127d6e/portadas/Eyeshield%2021.png"}'::jsonb, TRUE),
('1004', 'Koi wa ameagari no you ni', 'romance', 'pendiente', NULL, NOW()::text, NOW()::text, '', '{"capLeidos":0,"capTotales":82,"portadaUrl":"https://raw.githubusercontent.com/ronald1777/ProyectoFinalRonald19789/7edf2d3a636ec5ec67d4207341be5b479d127d6e/portadas/Koi%20wa%20ameagari%20no%20you%20ni.png"}'::jsonb, TRUE),
('1005', 'Madan no Ichi', 'fantasia', 'pendiente', NULL, NOW()::text, NOW()::text, '', '{"capLeidos":0,"capTotales":80,"portadaUrl":"https://raw.githubusercontent.com/ronald1777/ProyectoFinalRonald19789/7edf2d3a636ec5ec67d4207341be5b479d127d6e/portadas/Madan%20no%20Ichi.jpg"}'::jsonb, TRUE),
('1006', 'The Marshal King', 'scifi', 'leyendo', NULL, NOW()::text, NOW()::text, '', '{"capLeidos":27,"capTotales":27,"portadaUrl":"https://raw.githubusercontent.com/ronald1777/ProyectoFinalRonald19789/7edf2d3a636ec5ec67d4207341be5b479d127d6e/portadas/The%20Marshal%20King.jpeg"}'::jsonb, TRUE),
('1007', 'Overlord', 'fantasia', 'leyendo', NULL, NOW()::text, NOW()::text, '', '{"capLeidos":25,"capTotales":78,"portadaUrl":"https://raw.githubusercontent.com/ronald1777/ProyectoFinalRonald19789/7edf2d3a636ec5ec67d4207341be5b479d127d6e/portadas/Overlord.png"}'::jsonb, TRUE),
('1008', 'Ruri Dragon', 'slice', 'leyendo', NULL, NOW()::text, NOW()::text, '', '{"capLeidos":12,"capTotales":45,"portadaUrl":"https://raw.githubusercontent.com/ronald1777/ProyectoFinalRonald19789/7edf2d3a636ec5ec67d4207341be5b479d127d6e/portadas/Ruri%20Dragon.jpg"}'::jsonb, TRUE),
('1009', 'Yotsuba!', 'slice', 'leyendo', NULL, NOW()::text, NOW()::text, '', '{"capLeidos":30,"capTotales":113,"portadaUrl":"https://raw.githubusercontent.com/ronald1777/ProyectoFinalRonald19789/7edf2d3a636ec5ec67d4207341be5b479d127d6e/portadas/Yotsuba!.jpg"}'::jsonb, TRUE),
('1010', 'Detective Konan', 'misterio', 'leyendo', NULL, NOW()::text, NOW()::text, '', '{"capLeidos":15,"capTotales":1160,"portadaUrl":"https://raw.githubusercontent.com/ronald1777/ProyectoFinalRonald19789/7edf2d3a636ec5ec67d4207341be5b479d127d6e/portadas/Detective%20Konan.jpg"}'::jsonb, TRUE),
('1011', 'Kuroiwa Medaka', 'romance', 'leyendo', NULL, NOW()::text, NOW()::text, '', '{"capLeidos":20,"capTotales":220,"portadaUrl":"https://raw.githubusercontent.com/ronald1777/ProyectoFinalRonald19789/7edf2d3a636ec5ec67d4207341be5b479d127d6e/portadas/Kuroiwa%20Medaka.png"}'::jsonb, TRUE),
('1012', 'Mayonaka Heart Tune', 'musica', 'pendiente', NULL, NOW()::text, NOW()::text, '', '{"capLeidos":0,"capTotales":117,"portadaUrl":"https://raw.githubusercontent.com/ronald1777/ProyectoFinalRonald19789/7edf2d3a636ec5ec67d4207341be5b479d127d6e/portadas/Mayonaka%20Heart%20Tune.jpeg"}'::jsonb, TRUE),
('1013', 'Studio Cabana', 'musica', 'pendiente', NULL, NOW()::text, NOW()::text, '', '{"capLeidos":0,"capTotales":36,"portadaUrl":"https://raw.githubusercontent.com/ronald1777/ProyectoFinalRonald19789/7edf2d3a636ec5ec67d4207341be5b479d127d6e/portadas/Studio%20Cabana.jpg"}'::jsonb, TRUE)
ON CONFLICT (id) DO UPDATE
SET
  nombre = EXCLUDED.nombre,
  "categoriaId" = EXCLUDED."categoriaId",
  estado = EXCLUDED.estado,
  puntuacion = EXCLUDED.puntuacion,
  atributos = EXCLUDED.atributos,
  activo = EXCLUDED.activo;
