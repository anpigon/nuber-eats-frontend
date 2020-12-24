import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../__generated__/createRestaurant";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
// import { MY_RESTAURANTS_QUERY } from "./my-restaurants";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const client = useApolloClient();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      setUploading(false);
      const { name, categoryName, address } = getValues();
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      console.log("queryResult", queryResult);
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult?.myRestaurants,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: "Category",
                },
                coverImg: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: "Restaurant",
              },
              ...queryResult?.myRestaurants?.restaurants,
            ],
          },
        },
      });
      history.push("/");
    }
  };

  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
  });

  const {
    register,
    getValues,
    formState,
    errors,
    handleSubmit,
  } = useForm<IFormProps>({
    mode: "onChange",
  });

  const onSubmit = async () => {
    setUploading(true);
    const { file, name, categoryName, address } = getValues();
    const actualFile = file[0];
    const formBody = new FormData();
    formBody.append("file", actualFile);
    const { url: coverImg } = await fetch("http://localhost:4000/uploads", {
      method: "POST",
      body: formBody,
    }).then((r) => r.json());
    setImageUrl(coverImg);

    createRestaurantMutation({
      variables: {
        input: {
          name,
          categoryName,
          address,
          coverImg,
        },
      },
    });
  };

  return (
    <div className="container">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Restaurant</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Name"
          ref={register({
            required: "Name is required.",
            minLength: {
              value: 5,
              message: "name must be longer than or equal to 5 characters",
            },
          })}
        />
        {errors.name?.message && (
          <FormError errorMessage={errors.name.message} />
        )}
        <input
          className="input"
          type="text"
          name="address"
          placeholder="Address"
          ref={register({ required: "Address is required." })}
        />
        {errors.address?.message && (
          <FormError errorMessage={errors.address.message} />
        )}
        <input
          className="input"
          type="text"
          name="categoryName"
          placeholder="Category Name"
          ref={register({ required: "Category Name is required." })}
        />
        {errors.categoryName?.message && (
          <FormError errorMessage={errors.categoryName.message} />
        )}
        <input
          type="file"
          name="file"
          accept="image/*"
          ref={register({ required: true })}
        />
        {errors.file?.message && (
          <FormError errorMessage={errors.file.message} />
        )}
        <Button
          loading={uploading}
          canClick={formState.isValid}
          actionText="Create Restaurant"
        />
        {data?.createRestaurant?.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};
