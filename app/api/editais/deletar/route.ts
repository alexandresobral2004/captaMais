import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAllEditais, deleteEdital } from '@/lib/db/editais-store';

/**
 * DELETE /api/editais/deletar
 * Deleta um edital do banco e remove seus PDFs
 */
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID do edital é obrigatório' },
        { status: 400 }
      );
    }

    // Obter todos os editais (incluindo expirados/fechados)
    const editais = await getAllEditais(true);

    // Encontrar o edital
    const edital = editais.find(e => e.id === id);
    if (!edital) {
      return NextResponse.json(
        { error: 'Edital não encontrado' },
        { status: 404 }
      );
    }

    console.log(`🗑️ Deletando edital [${id}]: ${edital.titulo}`);

    // Deletar PDFs associados
    if (edital.pdfSalvoEm) {
      try {
        const pdfPath = path.join(process.cwd(), edital.pdfSalvoEm);
        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath);
          console.log(`  ✅ PDF deletado: ${edital.pdfSalvoEm}`);
        }
      } catch (err) {
        console.warn(`  ⚠️ Erro ao deletar PDF: ${(err as Error).message}`);
      }
    }

    // Deletar arquivo de conteúdo de texto se existir
    try {
      const conteudoPath = path.join(
        process.cwd(),
        'data/downloads',
        `edital-${id}-conteudo.txt`
      );
      if (fs.existsSync(conteudoPath)) {
        fs.unlinkSync(conteudoPath);
        console.log(`  ✅ Arquivo de conteúdo deletado`);
      }
    } catch (err) {
      console.warn(`  ⚠️ Erro ao deletar arquivo de conteúdo: ${(err as Error).message}`);
    }

    // Deletar do banco de dados
    await deleteEdital(id);

    console.log(`✅ Edital [${id}] deletado com sucesso`);

    return NextResponse.json({
      success: true,
      message: `Edital "${edital.titulo}" foi deletado com sucesso`,
      id
    });
  } catch (error) {
    console.error('❌ Erro ao deletar edital:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Erro ao deletar edital' },
      { status: 500 }
    );
  }
}
