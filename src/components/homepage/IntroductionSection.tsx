import Title from "../Title"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"

export default function IntroductionSection() {
    return (
        <section className="px-6 py-4 bg-pink-light flex flex-col gap-6">
            <article className="mt-6 flex flex-col gap-4">
                <Title>O que é a Copa Passa a Bola?</Title>
                <p className="text-justify text-gray-base md:text-lg lg:text-xl">
                    A <strong>Copa Passa a Bola (PAB)</strong> é um torneio de futebol feminino amador que vai muito além das quatro linhas. Criada com o propósito de fortalecer o protagonismo de mulheres no esporte, a competição reúne jogadoras de diferentes regiões para celebrar a potência coletiva, o respeito e a paixão pelo futebol. Além disso, a Copa busca incentivar a prática esportiva desde cedo, oferecendo oportunidades para jovens talentos e promovendo a inclusão social. Cada partida é organizada com atenção aos detalhes, garantindo que todas as participantes tenham uma experiência segura, divertida e inesquecível.
                </p>
            </article>

            <article className="mt-6 flex flex-col gap-4">
                <Title>Como funciona?</Title>
                <p className="text-justify text-gray-base md:text-lg lg:text-xl">
                    A Copa é aberta para <strong>times femininos amadores</strong>, que se inscrevem gratuitamente pela nossa plataforma. Após a inscrição, as organizadoras analisam os documentos enviados, validam os dados das equipes e fazem o chaveamento automático dos jogos, garantindo equilíbrio e competitividade entre os times. O processo é totalmente transparente, e as equipes recebem informações detalhadas sobre horários, locais e regras de cada partida.
                </p>
                <p className="text-justify text-gray-base md:text-lg lg:text-xl">
                    Durante o evento, todos os jogos acontecem no mesmo dia, promovendo um clima vibrante de confraternização e disputa saudável. Além das partidas, o espaço conta com ações culturais, feira de empreendedoras locais, workshops e rodas de conversa sobre o esporte e o papel das mulheres na sociedade. Essa integração permite que o público, atletas e familiares participem de uma experiência completa, unindo esporte, cultura e educação.
                </p>
            </article>

            <article className="mt-6 flex flex-col gap-4">
                <Title>Nosso objetivo</Title>
                <p className="text-justify text-gray-base md:text-lg lg:text-xl">
                    Mais do que entregar um troféu, a Copa PAB quer criar conexões, inspirar histórias e abrir caminhos para que mais meninas e mulheres ocupem o espaço que é delas — dentro e fora dos gramados. Nosso objetivo é fomentar a paixão pelo futebol, incentivar o trabalho em equipe, a liderança e a autoconfiança das participantes, gerando impacto positivo em suas vidas pessoais e profissionais.
                </p>
                <p className="text-justify text-gray-base md:text-lg lg:text-xl">
                    Se você acredita que o futebol é para todas, vem com a gente e <strong>passa a bola!</strong> Junte-se a uma comunidade que valoriza a diversidade, a inclusão e a igualdade de oportunidades, onde cada jogadora pode brilhar e contribuir para a construção de um futuro mais justo e inspirador para o esporte feminino.
                </p>
                  <div className="mt-6 text-center">
                    <Button variant="gradient" size="lg" asChild>
                        <Link to="/cadastrar">
                            Cadastre seu Time
                        </Link>
                    </Button>
                </div>
            </article>
        </section>
    )
}
