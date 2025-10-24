import Title from "../Title"
import imgCollaboratorsCopaPab from "@/assets/imgs/homepage/organizadoras-copa-pab.png"
import imgCollaboratorAna from "@/assets/imgs/homepage/organizadora-ana-clara.png"
import imgCollaboratorLeticia from "@/assets/imgs/homepage/organizadora-leticia.png"

export default function IntroductionSection() {
    return (
        <section className="px-6 py-4 bg-pink-light flex flex-col justify-center items-center">
            <Title>Quem organiza a Copa Passa a Bola?</Title>

            <div className="flex justify-center items-center mt-6">
                <picture className="flex justify-center items-center gap-0">
                    <img
                        src={imgCollaboratorAna}
                        alt="Organizadora Ana Clara"
                        className="hidden lg:block w-auto h-56 object-cover"
                    />
                    <img
                        src={imgCollaboratorsCopaPab}
                        alt="Organizadora Copa PAB"
                        className="w-auto md:max-w-10/12 lg:max-w-1/4 object-cover"
                    />
                    <img
                        src={imgCollaboratorLeticia}
                        alt="Organizadora Leticia"
                        className="hidden lg:block w-auto h-56 object-cover"
                    />
                </picture>
            </div>

            <article className="mt-6 flex flex-col gap-4 max-w-4xl">
                <p className="text-justify text-gray-base md:text-lg lg:text-xl">
                    Por trás da Copa Passa a Bola estão duas mulheres que acreditam no poder do futebol para transformar realidades: Ana Clara e Letícia.
                </p>
                <p className="text-justify text-gray-base md:text-lg lg:text-xl">
                    Amigas, educadoras e ativistas sociais, elas se uniram para criar um espaço onde mulheres pudessem jogar, se conectar e ocupar o lugar que é delas — dentro e fora do campo. A Copa PAB nasceu dessa vontade de fazer diferente, com mais acolhimento, representatividade e respeito.
                </p>
                <p className="text-justify text-gray-base md:text-lg lg:text-xl">
                    Ana Clara, além de organizadora, agora também vive uma nova fase como mãe. Sim, ela está grávida e segue acompanhando tudo com o mesmo carinho de sempre (só que agora com dois corações batendo por esse projeto!). Já a Letícia é aquela que resolve mil coisas ao mesmo tempo, segura o microfone, cuida da logística e ainda lembra do nome de quase todas as jogadoras.
                </p>
                <p className="text-justify text-gray-base md:text-lg lg:text-xl">
                    Juntas, elas formam o time que faz a Copa acontecer com amor, luta e muita bola no pé.
                </p>
            </article>
        </section>
    )
}
