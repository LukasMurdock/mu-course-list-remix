import { ApiTerm, CourseSections } from './api-types';

export const TermMap = {
  fall: 10,
  winter: 15,
  spring: 20,
  summer: 30,
};

export enum Term {
  FALL = 10,
  WINTER = 15,
  SPRING = 20,
  SUMMER = 30,
}

export const CampusMap = {
  Oxford: 'O',
  Hamilton: 'H',
  Luxembourg: 'L',
  Middletown: 'M',
};

export enum CampusCode {
  O = 'Oxford',
  H = 'Hamilton',
}

export enum CampusCode {
  Oxford = 'O',
  Hamilton = 'H',
  Luxembourg = 'L',
  Middletown = 'M',
}

export type TermStrings = keyof typeof Term;
export type CampusCodeStrings = keyof typeof CampusCode;

export async function searchMiamiCourses(input: {
  termId: number;
  campusCode: string;
  subject: string;
  courseNumber: number;
  courseSectionCode?: string;
}) {
  const base_url = `http://ws.miamioh.edu/courseSectionV2/${input.termId}.json`;
  const parameters = new URLSearchParams({
    campusCode: input.campusCode,
    courseSubjectCode: input.subject,
    courseNumber: String(input.courseNumber),
    courseSectionCode: input.courseSectionCode ?? '',
  });

  const endpoint = base_url + '?' + String(parameters);
  console.log({ endpoint });

  const response = await fetch(endpoint);
  const data = await response.json();
  return data as CourseSections;
}

/**
 * @see http://ws.miamioh.edu/api/swagger-ui/#!/academicTerm/get_academic_banner_v2_academicTerms
 */
export async function getAcademicTerms(ops: {
  termId: string;
  next: number;
  previous: number;
}) {
  const endpoint = 'http://ws.miamioh.edu/api/academic/banner/v2/academicTerms';
  const params = new URLSearchParams({
    termId: ops.termId,
    next: String(ops.next),
    previous: String(ops.previous),
  });
  const response = await fetch(`${endpoint}?${params}`, {
    headers: {
      Accept: 'application/json',
    },
  });
  const data = await response.json();
  return data as {
    data: ApiTerm[];
  };
}

export async function getCurrentAcademicTerm() {
  const response = await fetch(
    'https://ws.miamioh.edu/api/academic/banner/v2/academicTerms/current.json',
  );
  const data = await response.json();

  return data as {
    data: ApiTerm;
  };
}

// - Year `2023`
// - Term `20`
// - Campus Code `O`
// - Course Subject Code `MKT`
// - Course Section Code `C`
// - Course Number
