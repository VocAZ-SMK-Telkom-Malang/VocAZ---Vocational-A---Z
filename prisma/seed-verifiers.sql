-- =====================================================
-- SEED VERIFIER LIST
-- Inject list lembaga/industri yang bisa jadi verifier sertifikat
-- =====================================================

-- 1. LSP / BNSP
INSERT INTO certification_institutions (id, name, slug, type, license_number, email, phone, website, address, description)
VALUES
  (gen_random_uuid(), 'LSP Teknologi Digital Indonesia', 'lsp-teknologi-digital', 'lsp_bnsp', 'BNSP-LSP-001', 'info@lsptdi.id', '+62 21 5555 0001', 'https://lsptdi.id', 'Jl. Sudirman No. 1, Jakarta', 'LSP untuk sertifikasi bidang teknologi digital'),
  (gen_random_uuid(), 'LSP Komputer Indonesia', 'lsp-komputer-indonesia', 'lsp_bnsp', 'BNSP-LSP-002', 'admin@lspki.id', '+62 21 5555 0002', 'https://lspki.id', 'Jl. Thamrin No. 5, Jakarta', 'LSP sertifikasi komputer & jaringan'),
  (gen_random_uuid(), 'LSP Desain Komunikasi Visual', 'lsp-dkv', 'lsp_bnsp', 'BNSP-LSP-003', 'contact@lspdkv.id', '+62 22 5555 0003', 'https://lspdkv.id', 'Jl. Asia Afrika No. 10, Bandung', 'LSP desain grafis & multimedia'),
  (gen_random_uuid(), 'LSP Otomotif Indonesia', 'lsp-otomotif', 'lsp_bnsp', 'BNSP-LSP-004', 'info@lspotomotif.id', '+62 31 5555 0004', 'https://lspotomotif.id', 'Jl. Basuki Rahmat No. 20, Surabaya', 'LSP bidang otomotif & EV'),
  
  -- 2. Lembaga Pelatihan
  (gen_random_uuid(), 'Vocaz Academy', 'vocaz-academy', 'training', 'VOCAZ-TR-001', 'train@vocaz.id', '+62 21 5555 1000', 'https://vocaz.id', 'Jakarta', 'Lembaga pelatihan internal VocAZ'),
  (gen_random_uuid(), 'BPPTIK Kominfo', 'bpptik-kominfo', 'training', 'BPPTIK-001', 'info@bpptik.id', '+62 21 5555 1001', 'https://bpptik.id', 'Cikarang, Jawa Barat', 'Balai Pelatihan & Pengembangan Teknologi Informasi & Komunikasi'),
  (gen_random_uuid(), 'Digital Talent Scholarship', 'dts-kominfo', 'training', 'DTS-001', 'info@dts.id', '+62 21 5555 1002', 'https://digitalent.id', 'Jakarta', 'Program pelatihan digital Kominfo'),
  
  -- 3. Industri
  (gen_random_uuid(), 'PT Telkom Indonesia', 'telkom-industry', 'industry', 'TELKOM-001', 'training@telkom.co.id', '+62 21 5555 2000', 'https://telkom.co.id', 'Jl. Japati No. 1, Bandung', 'Verifier industri - Telkom'),
  (gen_random_uuid(), 'PT Garuda Spark Innovation', 'garuda-spark-verifier', 'industry', 'GSI-001', 'hr@garudaspark.id', '+62 21 5555 2001', 'https://garudaspark.id', 'Jakarta', 'Verifier industri - Garuda Spark'),
  (gen_random_uuid(), 'Bank Digital Indonesia', 'bdi-verifier', 'industry', 'BDI-001', 'training@bankdigital.id', '+62 21 5555 2002', 'https://bankdigital.id', 'Jakarta', 'Verifier industri - Bank Digital Indonesia')
ON CONFLICT (slug) DO NOTHING;

-- Cek hasil
SELECT id, name, slug, type FROM certification_institutions ORDER BY type, name;