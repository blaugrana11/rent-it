import { createAsync } from "@solidjs/router";
import { For, Show } from "solid-js";
import { db_users, db_ads } from "~/lib/db";
import { getlistingSchema } from "~/lib/listing"; // Ou ton schema zod
import { ObjectId } from "mongodb";

export const route = {
  load: async ({ params }: { params: { id: string } }) => {
    "use server";

    const userId = params.id;

    // Vérifie que c'est un ObjectId valide
    let user;
    try {
      user = await db_users.findOne({ _id: new ObjectId(userId) });
      if (!user) return { user: null, listings: [] };
    } catch (e) {
      return { user: null, listings: [] };
    }

    const listingsRaw = await db_ads.find({ userId }).toArray();
    const listings = getlistingSchema.array().safeParse(listingsRaw).success ? listingsRaw : [];

    return { user, listings };
  },
};

export default function ProfilePage() {
  const data = createAsync(() => route.load);

  return (
    <div class="max-w-4xl mx-auto p-6">
      <Show when={data()?.user} fallback={<p>Utilisateur introuvable.</p>}>
        <h1 class="text-2xl font-bold mb-4">
          Profil de {data()?.user.pseudo}
        </h1>

        <Show when={data()?.listings.length} fallback={<p>Aucune annonce publiée.</p>}>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <For each={data()?.listings}>
              {(listing) => (
                <div class="border rounded-xl p-4 shadow hover:shadow-md transition">
                  <h2 class="text-lg font-semibold">{listing.title}</h2>
                  <p class="text-sm text-gray-600">{listing.description}</p>
                  <p class="font-bold mt-2">{listing.price} €</p>
                  <Show when={listing.images?.length}>
                    <img src={listing.images[0]} alt="Image" class="mt-2 rounded w-full h-48 object-cover" />
                  </Show>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}