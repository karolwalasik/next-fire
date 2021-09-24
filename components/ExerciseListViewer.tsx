import React, { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { is } from "@babel/types";
import { Button } from "@material-ui/core";
export default function ExerciseListViewer({ exercises }) {
  return exercises
    ? exercises.map((exercise) => (
        <ExerciseItem exercise={exercise} key={exercise.slug} />
      ))
    : null;
}

interface IExerciseItemProps {
  exercise: any;
}

function ExerciseItem({ exercise }: IExerciseItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="card">
      <Link href={`/admin/exercises/${exercise.slug}`}>
        <h2>
          <a>{exercise.title}</a>
        </h2>
      </Link>
      <Button variant={"contained"} onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "collapse" : "expand"}
      </Button>
      {isExpanded && (
        <div>
          <ReactMarkdown>{exercise.content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
